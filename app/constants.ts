import { fragmentOn } from "basehub";

export const PAGE_SIZE = 1;

export const Post = fragmentOn("PostsItem", {
  _id: true,
  _slug: true,
  _title: true,
});

export type Post = fragmentOn.infer<typeof Post>;
