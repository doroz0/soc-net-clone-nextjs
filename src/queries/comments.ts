import { IGetRelatedResourcesExpression } from "@datx/swr";
import { Post } from "@/models/Post";

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
