import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { routeHits } from "../../metrics";

export const POST = async (request) => {
  const { name, email, password } = await request.json();

  // Increment Prometheus counter for POST /api/auth/register
  routeHits.inc({ route: '/api/auth/register', method: 'POST' });

  await connect();

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return new NextResponse("User has been created", {
      status: 201,
    });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};
