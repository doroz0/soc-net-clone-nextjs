import { FC, useMemo } from "react";
import { Button, StackProps, VStack } from "@chakra-ui/react";
import { Post as PostModel } from "@/models/Post";
import { useDatxInfinite } from "@datx/swr";
import { getPostComentsRelationshipPageKey } from "@/queries/posts";
import { Comment } from "../Comment/Comment";
import { ChevronUpIcon } from "@chakra-ui/icons";

export const CommentList: FC<{ post: PostModel } & StackProps> = ({ post, ...rest }) => {
  const getKey = getPostComentsRelationshipPageKey(post.id);
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
