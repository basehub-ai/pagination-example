"use client";
import * as React from "react";
import { Post } from "./constants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function Posts({
  initialPosts,
  numPages,
}: {
  initialPosts: Post[];
  numPages: number;
}) {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("p") ?? "1");
  const [posts, setPosts] = React.useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchPage() {
      if (currentPage === 1) {
        setPosts(initialPosts);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/get-page?p=${currentPage}`);
        const { posts } = await response.json();
        setPosts(posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPage();
  }, [currentPage, initialPosts]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {posts.map((post) => (
            <div key={post._id}>{post._title}</div>
          ))}

          <div style={{ marginTop: "1rem" }}>
            {Array.from({ length: numPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Link
                  key={pageNum}
                  href={`/?p=${pageNum}`}
                  style={{
                    margin: "0 0.25rem",
                    pointerEvents: pageNum === currentPage ? "none" : "auto",
                    opacity: pageNum === currentPage ? 0.5 : 1,
                    textDecoration: "none",
                  }}
                >
                  {pageNum}
                </Link>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
