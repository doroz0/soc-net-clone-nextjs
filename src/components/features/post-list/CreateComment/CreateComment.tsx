import { FC, useRef } from "react";
import { Button, Flex, FlexProps, Input } from "@chakra-ui/react";
import { Post as PostModel } from "@/models/Post";
import { useMutation } from "@datx/swr";
import { createComment } from "@/mutations/comments";
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

export const CreateComment: FC<{ post: PostModel } & FlexProps> = ({ post, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [create, { status: createStatus }] = useMutation(createComment as any, {
    onSuccess: async () => {
      const input = inputRef.current;
      if (input) input.value = "";
    },
  });

  const randomComment = () => {
    if (inputRef.current) {
      inputRef.current.value = lorem.generateParagraphs(1);
      create({ post, body: inputRef.current.value });
    }
  };

  const comment = () => {
    if (inputRef.current) create({ post, body: inputRef.current.value });
  };

  return (
    <Flex {...rest}>
      <Input ref={inputRef} placeholder="Add comment" />

      <Button isLoading={createStatus === "running"} onClick={comment}>
        Comment
      </Button>

      {createStatus !== "running" && <Button onClick={randomComment}>RndComment</Button>}
    </Flex>
  );
};
