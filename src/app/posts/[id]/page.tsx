"use client";
import React from "react";
// import Image from "next/image";
import { useState, useEffect } from "react";
import { Post } from "@/types/Posts";
import { useParams } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { CategoriesOptions } from "@/types/CategoriesOptions";
import "@/app/globals.css";

const ArticleDetails: React.FC = () => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return date.toLocaleDateString("ja-JP", options);
  };

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { post } = await response.json();
        console.log({ post });
        setPost(post);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!post) return <div>投稿が見つかりません</div>;

  return (
    <div className="sm:h-1 md:px-0 md:w-[1024px]">
      <Header />

      <div
        style={{ border: "none" }}
        className="my-10 m-80 px-6 py-3 border-solid border-[13px] border-base-700 sm:m-8"
      >
        <ul>
          <li key={post.id}>
            <div className="img w-[800px] h-[400px] relative sm:w-[375px] sm:h-[200px] md:w-full md:h-auto md:flex md:justify-center overflow-hidden">
              {/* <Image
            src={post.thumbnailUrl}
            alt="img"
            layout="fill"
            objectFit="cover"
          /> */}
            </div>
            <div className="pt-5 flex items-center justify-between md:space-x-10">
              <div className="text-xs border-gray-400 text-neutral-500 md:text-2xl md:mr-10">
                {formatDate(post.createdAt)}
              </div>
              <div className="self-start text-right mx-30">
                {post.postCategories.map((pc) => (
                  <span
                    key={pc.category.id}
                    className="m-[6px] p-[6px] text-[13px] border border-solid border-blue-600 rounded
                    text-blue-600 sm:text-[9px] sm:m-[3px] sm:p-[3px] md:text-2xl md:m-[10px] md:p-[10px]"
                  >
                    {CategoriesOptions.find(
                      (option) => option.value === pc.category.id
                    )?.name || pc.category.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-[25px] mt-2 md:text-4xl md:mt-20">{post.title}</div>
            <div
              className="block mt-2 text-[16px] md:text-4xl md:mt-10"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ArticleDetails;
