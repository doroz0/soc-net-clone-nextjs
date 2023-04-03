import { FC, useRef, useState } from "react";
import { Button, Center, Divider, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { Post as PostModel } from "@/models/Post";
import { useDatx, useMutation } from "@datx/swr";
import { getPostComentsRelationshipQuery } from "@/queries/comments";
import { createComment } from "@/mutations/comments";

// @ts-ignore
import { CloseIcon } from "@chakra-ui/icons";

export const Post: FC<{ post: PostModel; destroy: () => void; select: () => void }> = ({ post, select, destroy }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showComments, setShowComments] = useState(false);
  const { data: comments, error, mutate } = useDatx(showComments ? getPostComentsRelationshipQuery(post?.id) : null);

  // @ts-ignore
  const [create, { status }] = useMutation(createComment, {
    onSuccess: async () => {
      const input = inputRef.current;
      if (input) input.value = "";
      mutate();
    },
  });

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
            <Button variant="ghost" size="xs" onClick={select}>
              Edit post
            </Button>
            <Button variant="ghost" size="xs" onClick={() => setShowComments((s) => !s)}>
              {showComments ? "Hide" : "See"} comments
            </Button>
          </Flex>
        </Flex>

        <Center
          p="24px"
          border="1px solid black"
          borderRadius="8px"
          borderLeftRadius="0"
          _hover={{ borderColor: "red.500", bg: "red.100", cursor: "pointer" }}
          onClick={destroy}
        >
          <CloseIcon color="red.500" boxSize="16px" />
        </Center>
      </Flex>

      {showComments && (
        <VStack
          ml="24px"
          mr="65px"
          p="8px"
          spacing="4px"
          alignItems="flex-start"
          border="solid 1px black"
          borderTop="none"
          borderBottomRadius="8px"
          bg="blackAlpha.100"
        >
          {(comments?.data || []).map((comment) => (
            <Flex key={comment.id} p="4px" w="full" _hover={{ bg: "blackAlpha.300" }}>
              {comment.body}
            </Flex>
          ))}
          <Flex w="full">
            <Input ref={inputRef} placeholder="Add comment" />
            <Button onClick={() => create({ post: post, body: inputRef.current?.value })}>Comment</Button>
          </Flex>
        </VStack>
      )}
    </Flex>
  );
};
