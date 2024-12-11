"use client";
import * as React from "react";
import { Post } from "./constants";
import Link from "next/link";

const pagesCache = new Map<number, Post[]>();

export function Posts({
  initialPosts,
  numPages,
}: {
  initialPosts: Post[];
  numPages: number;
}) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [posts, setPosts] = React.useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const page = parseInt(url.searchParams.get("p") ?? "1");
    setCurrentPage(page);
  }, []);

  React.useEffect(() => {
    async function fetchPage() {
      if (currentPage === 1) {
        setPosts(initialPosts);
        return;
      }

      if (pagesCache.has(currentPage)) {
        setPosts(pagesCache.get(currentPage)!);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/get-page?p=${currentPage}`);
        const { posts } = await response.json();
        setPosts(posts);
        pagesCache.set(currentPage, posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPage();
  }, [currentPage, initialPosts]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          Loading...
        </div>
      ) : (
        <>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {posts.map((post) => (
              <div
                key={post._id}
                style={{
                  padding: "1rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  fontSize: "1.1rem",
                }}
              >
                {post._title}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {Array.from({ length: numPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Link
                  key={pageNum}
                  href={`/?p=${pageNum}`}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor:
                      pageNum === currentPage ? "#e0e0e0" : "transparent",
                    borderRadius: "4px",
                    color: pageNum === currentPage ? "#333" : "#666",
                    textDecoration: "none",
                    pointerEvents: pageNum === currentPage ? "none" : "auto",
                    transition: "all 0.2s ease",
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
