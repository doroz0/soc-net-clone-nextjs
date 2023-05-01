import { FC, useRef } from "react";
import { useMutation } from "@datx/swr";
import { Button, Flex, FlexProps, Input } from "@chakra-ui/react";
import { createPost } from "@/mutations/posts";
import { mutate } from "swr";
import { getPostsQuery } from "@/queries/posts";
import { lorem } from "@/utils/lorem";
import { useRouter } from "next/router";

export const PostCreator: FC<FlexProps> = ({ ...rest }) => {
  const { query } = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [create, { status: createStatus }] = useMutation(createPost as any, {
    onSuccess: () => {
      inputRef.current!.value = "";
      mutate(getPostsQuery(query?.id as string));
    },
  });

  const randomPost = () => {
    if (inputRef.current) {
      inputRef.current.value = lorem(1);
      create(inputRef.current.value);
    }
  };

  const post = () => {
    if (inputRef.current?.value) {
      create(inputRef.current.value);
    }
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
