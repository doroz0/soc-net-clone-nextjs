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

export const getPostComentsRelationshipPageQuery = (id?: string, index = 1, size = 4) =>
  id
    ? ({
        id,
        op: "getRelatedResources",
        type: `posts`,
        relation: "comments",
        queryParams: {
          sort: "-created",
          include: ["post", "user"],
          fields: {
            posts: "id",
            users: ["id", "username"],
          },
          custom: [
            { key: "page[number]", value: String(index) },
            { key: "page[size]", value: String(size) },
          ],
        },
      } as const satisfies IGetRelatedResourcesExpression<typeof Post>)
    : null;
