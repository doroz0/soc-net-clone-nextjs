import { FC, useRef, useState } from "react";
import { Button, Center, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { Post as PostModel } from "@/models/Post";
import { CollectionResponse, useDatxInfinite, useMutation } from "@datx/swr";
import { createComment } from "@/mutations/comments";
import { getPostComentsRelationshipPageQuery, postsQuery } from "@/queries/posts";
import { getModelRefMeta } from "@datx/jsonapi";
import { Comment } from "./Comment";
import { deletePost } from "@/mutations/posts";
import { mutate } from "swr";
import { PostModal } from "./PostModal";
import { ChevronUpIcon, CloseIcon } from "@chakra-ui/icons";
import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 4,
    min: 1,
  },
  wordsPerSentence: {
    max: 10,
    min: 4,
  },
});

export const Post: FC<{ post: PostModel }> = ({ post }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showComments, setShowComments] = useState(false);
  const [showPostModal, setPostModal] = useState(false);

  const getKey = (pageIndex: number, previousPageData: CollectionResponse | null) => {
    if (!showComments || (previousPageData && previousPageData.data.length === 0)) return null;
    return getPostComentsRelationshipPageQuery(post?.id, pageIndex + 1, 4);
  };

  const {
    data: comments,
    mutate: mutateComments,
    size,
    setSize,
  } = useDatxInfinite(getKey, {
    revalidateAll: true,
  });

  const [create, { status: createStatus }] = useMutation(createComment as any, {
    onSuccess: async () => {
      const input = inputRef.current;
      if (input) input.value = "";
    },
  });

  const [destroy] = useMutation(deletePost as any, {
    onSuccess: async () => {
      mutate(postsQuery);
    },
  });

  const randomComment = async () => {
    if (inputRef.current) {
      inputRef.current.value = lorem.generateParagraphs(1);
      return create({ post, body: inputRef.current?.value });
    }
  };

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
          <Button variant="link" onClick={() => setSize(size + 1)}>
            <ChevronUpIcon /> Load more
          </Button>
          {(
            comments
              ?.map((c) => c.data)
              .flat()
              .reverse() || []
          ).map((comment) => (
            <Comment key={comment.id} comment={comment as any} />
          ))}
          <Flex w="full">
            <Input ref={inputRef} placeholder="Add comment" />
            <Button
              isLoading={createStatus === "running"}
              onClick={() => create({ post, body: inputRef.current?.value }).then(() => mutateComments())}
            >
              Comment
            </Button>
            <Button isLoading={createStatus === "running"} onClick={() => randomComment().then(() => mutateComments())}>
              RndComment
            </Button>
          </Flex>
        </VStack>
      )}

      {showPostModal && <PostModal id={post.id} onClose={() => setPostModal(false)} />}
    </Flex>
  );
};
