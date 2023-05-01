import { CollectionResponse, IGetManyExpression, IGetOneExpression, IGetRelatedResourcesExpression } from "@datx/swr";
import { Post } from "../models/Post";

export const getPostsQuery = (filterByUserId?: string) =>
  ({
    op: "getMany",
    type: "posts",
    queryParams: {
      sort: "-created",
      include: ["user"],
      fields: {
        users: ["id", "username"],
      },
      custom: [...(filterByUserId ? [{ key: "filter", value: `equals(user.id,\'${filterByUserId}\')` }] : [])],
    },
  } as const satisfies IGetManyExpression<typeof Post>);

export const getPostQuery = (id: string) =>
  ({
    id,
    op: "getOne",
    type: "posts",
  } as const satisfies IGetOneExpression<typeof Post>);

export const getPostComentsRelationshipPageQuery = (id: string, index = 1, size = 4) =>
  ({
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
  } as const satisfies IGetRelatedResourcesExpression<typeof Post>);

export const getPostComentsRelationshipPageKey =
  (postId: string) => (pageIndex: number, previousPageData: CollectionResponse | null) => {
    if (previousPageData && previousPageData.data.length === 0) return null;
    return getPostComentsRelationshipPageQuery(postId, pageIndex + 1, 4);
  };
