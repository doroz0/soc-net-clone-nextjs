import { FC, useRef } from "react";
import { Button, Center, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { Post as PostModel } from "@/models/Post";
import { useDatx, useMutation } from "@datx/swr";
import { getCommentsQuery } from "@/queries/comments";
import { createComment } from "@/mutations/comments";

// @ts-ignore
import { CloseIcon } from "@chakra-ui/icons";

export const Post: FC<{ post: PostModel; destroy: () => void; select: () => void }> = ({ post, select, destroy }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: comments, error, mutate } = useDatx(post ? getCommentsQuery(`${post.id}`) : null);

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
          userSelect="none"
          _hover={{ borderColor: "blue.500", bg: "blackAlpha.200", cursor: "pointer" }}
          onClick={select}
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
        </Flex>

        <Center
          p="24px"
          border="1px solid black"
          borderRadius="8px"
          borderLeftRadius="0"
          _hover={{ borderColor: "red.500", bg: "red.100", cursor: "pointer" }}
          onClick={destroy}
        >
          <CloseIcon color="red.500" />
        </Center>
      </Flex>

      <VStack ml="64px" spacing="4px" alignItems="flex-start">
        {(comments?.data || []).map((comment) => (
          <Flex key={comment.id}>{comment.body}</Flex>
        ))}
        <Flex w="full">
          <Input ref={inputRef} placeholder="Add comment" />
          <Button onClick={() => create({ post: post, body: inputRef.current?.value })}>Comment</Button>
        </Flex>
      </VStack>
    </Flex>
  );
};
