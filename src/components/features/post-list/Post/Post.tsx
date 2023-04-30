import { FC, useState } from "react";
import { Button, Center, Flex, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { Post as PostModel } from "@/models/Post";
import { useMutation } from "@datx/swr";
import { postsQuery } from "@/queries/posts";
import { getModelRefMeta } from "@datx/jsonapi";
import { deletePost } from "@/mutations/posts";
import { mutate } from "swr";
import { EditPostModal } from "../EditPostModal/EditPostModal";
import { CloseIcon } from "@chakra-ui/icons";
import { CommentList } from "../CommentList/CommentList";
import { CreateComment } from "../CreateComment/CreateComment";

export const Post: FC<{ post: PostModel }> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [showPostModal, setPostModal] = useState(false);

  const [destroy] = useMutation(deletePost as any, {
    onSuccess: async () => {
      mutate(postsQuery);
    },
  });

  const commentsCount = getModelRefMeta(post)?.comments?.total || 0;

  return (
    <Flex flexDir="column" w="full">
      <Flex w="full">
        <Flex
          flex={1}
          flexDir="column"
          border="1px solid black"
          borderRadius="8px"
          borderRight="none"
          borderRightRadius="0"
          p="16px"
        >
          <Text>{post.body}</Text>

          <Flex flexDir="column" fontSize="12px">
            <Text>
              Created: {formatDistanceToNow(new Date(post.created), { includeSeconds: true, addSuffix: true })}
            </Text>
            {post.modified && (
              <Text>
                Modified: {formatDistanceToNow(new Date(post.modified), { includeSeconds: true, addSuffix: true })}
              </Text>
            )}
          </Flex>

          <Flex my="16px" ml="-16px" h="1px" w="calc(100% + 32px)" bg="black" />

          <Flex justifyContent="flex-end">
            <Button variant="ghost" size="xs" onClick={() => setPostModal(true)}>
              Edit post
            </Button>
            <Button variant="ghost" size="xs" onClick={() => setShowComments((s) => !s)}>
              {showComments ? "Hide" : "See"} comments ({commentsCount})
            </Button>
          </Flex>
        </Flex>

        <Center
          p="24px"
          border="1px solid black"
          borderRadius="8px"
          borderLeftRadius="0"
          _hover={{ borderColor: "red.500", bg: "red.100", cursor: "pointer" }}
          onClick={() => destroy(post.id)}
        >
          <CloseIcon color="red.500" boxSize="16px" />
        </Center>
      </Flex>

      {showComments && (
        <Flex
          direction="column"
          ml="24px"
          mr="65px"
          p="8px"
          border="solid 1px black"
          borderTop="none"
          borderBottomRadius="8px"
          bg="blackAlpha.100"
        >
          <CommentList post={post} />
          <CreateComment post={post} w="full" />
        </Flex>
      )}

      {showPostModal && <EditPostModal id={post.id} onClose={() => setPostModal(false)} />}
    </Flex>
  );
};
