import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

async function getData() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/posts`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status} - ${res.statusText}`);
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }

    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("getData error:", error);
    throw error;
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Blog = async () => {
  const data = await getData();
  return (
    <div className={styles.mainContainer}>
      {data.map((item) => (
        <Link href={`/blog/${item._id}`} className={styles.container} key={item.id}>
          <div className={styles.imageContainer}>
            <Image
              src={item.img}
              alt=""
              width={400}
              height={250}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>{item.title}</h1>
            <p className={styles.desc}>{item.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Blog;
