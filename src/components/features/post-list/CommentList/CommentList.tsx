import { FC, useMemo } from "react";
import { Button, StackProps, VStack } from "@chakra-ui/react";
import { Post as PostModel } from "@/models/Post";
import { CollectionResponse, useDatxInfinite } from "@datx/swr";
import { getPostComentsRelationshipPageQuery } from "@/queries/posts";
import { Comment } from "../Comment/Comment";
import { ChevronUpIcon } from "@chakra-ui/icons";

export const CommentList: FC<{ post: PostModel } & StackProps> = ({ post, ...rest }) => {
  const getKey = (pageIndex: number, previousPageData: CollectionResponse | null) => {
    if (previousPageData && previousPageData.data.length === 0) return null;
    return getPostComentsRelationshipPageQuery(post.id, pageIndex + 1, 4);
  };

  const { data: comments, size, setSize } = useDatxInfinite(getKey, { revalidateAll: true });
  const commentsFlatten = useMemo(() => (comments?.map((c) => c.data).flat() || []).reverse(), [comments]);

  return (
    <VStack spacing="4px" alignItems="flex-start" {...rest}>
      <Button variant="link" onClick={() => setSize(size + 1)}>
        <ChevronUpIcon /> Load more
      </Button>

      {commentsFlatten.map((comment) => (
        <Comment key={comment.id} comment={comment as any} />
      ))}
    </VStack>
  );
};
