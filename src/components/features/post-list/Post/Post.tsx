import { FC, useState } from "react";
import { Button, ButtonGroup, Center, Flex, Text } from "@chakra-ui/react";
import { Post as PostModel } from "@/models/Post";
import { useMutation } from "@datx/swr";
import { postsQuery } from "@/queries/posts";
import { getModelRefMeta } from "@datx/jsonapi";
import { deletePost } from "@/mutations/posts";
import { mutate } from "swr";
import { EditPostModal } from "../EditPostModal/EditPostModal";
import { CommentList } from "../CommentList/CommentList";
import { CreateComment } from "../CreateComment/CreateComment";
import { formatDistanceToNow } from "@/utils/dates";
import { useSession } from "next-auth/react";

export const Post: FC<{ post: PostModel }> = ({ post }) => {
  const { data: session } = useSession();
  const hasOwnership = session?.user.id === post.user.id;

  const [showComments, setShowComments] = useState(false);
  const [showPostModal, setPostModal] = useState(false);

  const [destroy, { status: destoryStatus }] = useMutation(deletePost as any, {
    onSuccess: async () => {
      mutate(postsQuery);
    },
  });

  const commentsCount = getModelRefMeta(post)?.comments?.total || 0;
  const toggleComments = () => setShowComments((s) => !s);
  const toggleEditPost = () => setPostModal((s) => !s);
  const destroyPost = () => destroy(post.id);

  return (
    <Flex flexDir="column">
      <Flex flexDir="column" border="1px solid black" borderRadius="8px" p="16px">
        <Text fontWeight="bold">{`${post.user.username}${hasOwnership ? " (You)" : ""}`}</Text>
        <Text>{post.body}</Text>

        <Flex flexDir="column" fontSize="12px">
          <Text>Created: {formatDistanceToNow(post.created)}</Text>
          {post.modified && <Text>Modified: {formatDistanceToNow(post.modified)}</Text>}
        </Flex>

        <Flex my="16px" ml="-16px" h="1px" w="calc(100% + 32px)" bg="black" />

        <ButtonGroup justifyContent="flex-end" variant="ghost" size="xs">
          <Button color="red.500" onClick={destroyPost} isLoading={destoryStatus === "running"}>
            Delete post
          </Button>
          <Button onClick={toggleEditPost}>Edit post</Button>
          <Button onClick={toggleComments}>
            {showComments ? "Hide" : "See"} comments ({commentsCount})
          </Button>
        </ButtonGroup>
      </Flex>

      {showComments && (
        <Flex
          direction="column"
          mx="24px"
          p="8px"
          border="solid 1px black"
          borderTop="none"
          borderBottomRadius="8px"
          bg="blackAlpha.100"
        >
          <CommentList post={post} />
          <CreateComment post={post} mt="16px" />
        </Flex>
      )}

      {showPostModal && <EditPostModal post={post} onClose={toggleEditPost} />}
    </Flex>
  );
};
