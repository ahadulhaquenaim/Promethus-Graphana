import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";
import { revalidatePath } from "next/cache";
import { routeHits } from '../metrics';

export const GET = async (request) => {
  const url = new URL(request.url);

  const username = url.searchParams.get("username");

  // Increment Prometheus counter for GET /api/posts
  routeHits.inc({ route: '/api/posts', method: 'GET' });

  try {
    await connect();

    const posts = await Post.find(username && { username });

    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request) => {
  const body = await request.json();

  const newPost = new Post(body);

  // Increment Prometheus counter for POST /api/posts
  routeHits.inc({ route: '/api/posts', method: 'POST' });

  try {
    await connect();

    await newPost.save();

    // Revalidate the blog page to show new posts
    revalidatePath('/blog');

    return new NextResponse("Post has been created", { status: 201 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
