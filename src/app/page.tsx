"use client";
import { Post } from "@/types/Posts";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "./_component/Header";
import { categoriesOptions } from "@/types/categoriesOptions"; 
import  "./globals.css";

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    return date.toLocaleDateString("ja-JP", options);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { posts } = await response.json();
        console.log({ posts });
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, []);

  if (!posts) return <div>投稿が見つかりません</div>;

  return (
    <div className="sm:px-0 sm:w-[430px] md:px-0">
      <Header />
      {posts?.map((post) => (
        <div
          key={post.id}
          className="my-10 m-80 px-6 py-3 text-[16px] border-solid border-[1.8px]
            border-base-700 hover:bg-gray-300 sm:mx-1 sm:my-5 md:mx-1 md:my-10"
        >
          <ul>
            <li className="p-[10px] sm:p-[3px]">
              <Link href={`/posts/${post.id}`}>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-neutral-500 md:text-2xl">
                    {formatDate(post.createdAt)}
                  </div>

                  <div className="self-start text-right mx-10">
                    {post.postCategories.map((pc) => (
                      <span
                        key={pc.category.id}
                        className="m-[6px] p-[6px] text-[13px] border border-solid border-blue-600 
                        rounded text-blue-600 sm:text-[9px] sm:m-[3px] sm:p-[3px] md:text-2xl"
                      >
                        {categoriesOptions.find(
                          (option) => option.value === pc.category.id
                        )?.name || pc.category.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-[25px] md:text-4xl">{post.title}</div>
                <div
                  className="mt-2 pt-2 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
              </Link>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
