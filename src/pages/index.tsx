import { useRef, useState } from "react";
import { useDatx, useMutation } from "@datx/swr";
import { Button, Center, Flex, Input, Spinner, VStack } from "@chakra-ui/react";
import { LoremIpsum } from "lorem-ipsum";
import { createPost, deletePost } from "@/mutations/posts";
import { postsQuery } from "@/queries/posts";
import { PostModal } from "@/components/PostModal";

import { Post } from "@/components/Post";

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

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const { data: posts, error, mutate } = useDatx(postsQuery);

  // @ts-ignore
  const [create, { status: createStatus }] = useMutation(createPost, {
    onSuccess: async () => {
      const input = inputRef.current;
      if (input) input.value = "";
      mutate();
    },
  });

  // @ts-ignore
  const [destroy, { status: destroyStatus }] = useMutation(deletePost, {
    onSuccess: async () => {
      mutate();
    },
  });

  const randomPost = () => {
    if (inputRef.current) {
      inputRef.current.value = lorem.generateParagraphs(1);
      create(inputRef.current?.value);
    }
  };

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <Flex p="24px" flexDir="column" justifyContent="flex-start">
      <Flex mt="24px">
        <Input ref={inputRef} placeholder="New post" isDisabled={createStatus === "running"} />
        <Button onClick={() => create(inputRef.current?.value)} isLoading={createStatus === "running"}>
          Post
        </Button>
        <Button onClick={randomPost} isLoading={createStatus === "running"}>
          RndPost
        </Button>
      </Flex>

      <VStack pos="relative" spacing="4px" mt="24px">
        {posts?.data.map((post) => (
          <Post
            key={post.id}
            post={post}
            destroy={() => destroy(`${post.id}`)}
            select={() => setSelectedPost(post.id)}
          />
        ))}

        {destroyStatus === "running" && (
          <Center pos="absolute" w="100vw" h="calc(100% + 48px)" top="-24px" bg="blackAlpha.500">
            <Spinner boxSize="100px" />
          </Center>
        )}
      </VStack>

      <PostModal id={selectedPost} onClose={() => setSelectedPost(null)} />
    </Flex>
  );
}
