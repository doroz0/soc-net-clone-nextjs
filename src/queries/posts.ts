import { IGetManyExpression, IGetOneExpression } from "@datx/swr";
import { Post } from "../models/Post";

export const postsQuery: IGetManyExpression<typeof Post> = {
  op: "getMany",
  type: "posts",
  queryParams: {
    sort: "-created",
  },
};

export const getPostQuery = (id: string): IGetOneExpression<typeof Post> => ({
  id,
  op: "getOne",
  type: "posts",
});
