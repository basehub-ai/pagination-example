import { Pump } from "basehub/react-pump";
import { Posts } from "./posts";
import { PAGE_SIZE, Post } from "./constants";

export default function Home() {
  return (
    <Pump
      queries={[
        {
          blog: {
            posts: {
              __args: {
                first: PAGE_SIZE,
              },
              items: Post,
              _meta: {
                totalCount: true,
              },
            },
          },
        },
      ]}
    >
      {async ([{ blog }]) => {
        "use server";

        return (
          <Posts
            initialPosts={blog.posts.items}
            numPages={Math.ceil(blog.posts._meta.totalCount / PAGE_SIZE)}
          />
        );
      }}
    </Pump>
  );
}
