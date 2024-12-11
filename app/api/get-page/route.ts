import { PAGE_SIZE, Post } from "@/app/constants";
import { basehub } from "basehub";
import { draftMode } from "next/headers";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const pageRaw = url.searchParams.get("p");
  const page = parseInt(pageRaw || "1");

  const data = await basehub({ draft: (await draftMode()).isEnabled }).query({
    blog: {
      posts: {
        __args: {
          first: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        },
        items: Post,
      },
    },
  });

  return new Response(JSON.stringify({ posts: data.blog.posts.items }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
