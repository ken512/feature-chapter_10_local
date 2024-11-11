import { Category } from "@/types/Category"
export type Post = {
  id: number
  title: string
  content: string
  createdAt: string
  postCategories: {category: Category}[];
  thumbnailImageKey: string
}


export type MicroCmsPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  categories: { id: string; name: string }[]; 
  thumbnailImageKey: { url: string; height: number; width: number };
}