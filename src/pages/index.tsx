import { useRef } from "react";
import { useDatx, useMutation } from "@datx/swr";
import { Button, Center, Flex, Input, Spinner, VStack } from "@chakra-ui/react";
import { LoremIpsum } from "lorem-ipsum";
import { createPost } from "@/mutations/posts";
import { postsQuery } from "@/queries/posts";
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
  const { data: posts, error, mutate, isValidating } = useDatx(postsQuery);

  const [create, { status: createStatus }] = useMutation(createPost as any, {
    onSuccess: async () => {
      const input = inputRef.current;
      if (input) input.value = "";
      mutate();
    },
  });

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  const randomPost = () => {
    if (inputRef.current) {
      inputRef.current.value = lorem.generateParagraphs(1);
      create(inputRef.current?.value);
    }
  };

  return (
    <Center mx="auto" maxW="768px">
      <Flex p="24px" flexDir="column" justifyContent="flex-start">
        <Flex mt="24px">
          <Input ref={inputRef} placeholder="New post" isDisabled={createStatus === "running"} />
          <Button
            onClick={() => inputRef.current && create(inputRef.current.value)}
            isLoading={createStatus === "running"}
          >
            Post
          </Button>
          <Button onClick={randomPost} isLoading={createStatus === "running"}>
            RndPost
          </Button>
        </Flex>

        <VStack pos="relative" spacing="24px" mt="24px">
          {posts?.data.map((post) => (
            <Post key={post.id} post={post} />
          ))}

          {posts?.data && isValidating && (
            <Center pos="fixed" top="0" left="0" w="100vw" h="100vh" bg="blackAlpha.500">
              <Spinner boxSize="100px" />
            </Center>
          )}
        </VStack>
      </Flex>
    </Center>
  );
}
