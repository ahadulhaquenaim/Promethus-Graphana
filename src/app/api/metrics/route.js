import { NextResponse } from 'next/server';
import { register, totalUsers, totalPosts, usersCreatedToday, postsCreatedToday, dbConnectionStatus } from '../metrics';
import connect from '@/utils/db';
import User from '@/models/User';
import Post from '@/models/Post';
import mongoose from 'mongoose';

async function updateMongoDBMetrics() {
  try {
    // Connect to MongoDB
    await connect();
    
    // Update connection status
    dbConnectionStatus.set(mongoose.connection.readyState === 1 ? 1 : 0);
    
    // Get total counts
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    
    totalUsers.set(userCount);
    totalPosts.set(postCount);
    
    // Get today's counts
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const usersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });
    
    const postsToday = await Post.countDocuments({
      createdAt: { $gte: today }
    });
    
    usersCreatedToday.set(usersToday);
    postsCreatedToday.set(postsToday);
    
  } catch (error) {
    console.error('Error updating MongoDB metrics:', error);
    dbConnectionStatus.set(0);
  }
}

export async function GET() {
  // Update MongoDB metrics before returning
  await updateMongoDBMetrics();
  
  const metrics = await register.metrics();
  return new NextResponse(metrics, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
