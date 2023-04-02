import { IGetManyExpression } from "@datx/swr";
import { Comment } from "@/models/Comment";

export const getCommentsQuery = (id: string): IGetManyExpression<typeof Comment> => ({
  op: "getMany",
  type: `posts/${id}/comments` as any,
  queryParams: {
    sort: "created",
  },
});
