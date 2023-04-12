import { IGetOneExpression } from "@datx/swr";
import { Comment } from "@/models/Comment";

export const getCommentQuery = (id: string): IGetOneExpression<typeof Comment> => ({
  id,
  op: "getOne",
  type: "comments",
});
