import { FC, useRef } from "react";
import { useMutation } from "@datx/swr";
import { Button, Flex, FlexProps, Input } from "@chakra-ui/react";
import { LoremIpsum } from "lorem-ipsum";
import { createPost } from "@/mutations/posts";
import { mutate } from "swr";
import { postsQuery } from "@/queries/posts";

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

export const PostCreator: FC<FlexProps> = ({ ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [create, { status: createStatus }] = useMutation(createPost as any, {
    onSuccess: async () => {
      const input = inputRef.current;
      if (input) input.value = "";
      mutate(postsQuery);
    },
  });

  const randomPost = () => {
    if (inputRef.current) {
      inputRef.current.value = lorem.generateParagraphs(1);
      create(inputRef.current.value);
    }
  };

  const post = () => {
    if (inputRef.current) create(inputRef.current.value);
  };

  return (
    <Flex {...rest}>
      <Input ref={inputRef} placeholder="New post" isDisabled={createStatus === "running"} />

      <Button onClick={post} isLoading={createStatus === "running"}>
        Post
      </Button>

      {createStatus !== "running" && <Button onClick={randomPost}>RndPost</Button>}
    </Flex>
  );
};
