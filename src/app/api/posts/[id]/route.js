import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";
import { routeHits } from "../../metrics";

export const GET = async (request, { params }) => {
  const { id } = params;

  // Increment Prometheus counter for GET /api/posts/[id]
  routeHits.inc({ route: '/api/posts/[id]', method: 'GET' });

  try {
    await connect();

    const post = await Post.findById(id);

    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  const { id } = params;

  // Increment Prometheus counter for DELETE /api/posts/[id]
  routeHits.inc({ route: '/api/posts/[id]', method: 'DELETE' });

  try {
    await connect();

    await Post.findByIdAndDelete(id);

    return new NextResponse("Post has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
