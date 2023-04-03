import { IGetManyExpression, IGetOneExpression, IGetRelatedResourcesExpression } from "@datx/swr";
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

export const getPostComentsRelationshipQuery = (id?: string) =>
  id
    ? ({
        id,
        op: "getRelatedResources",
        type: `posts`,
        relation: "comments",
        queryParams: {
          sort: "created",
        },
      } as const satisfies IGetRelatedResourcesExpression<typeof Post>)
    : null;
