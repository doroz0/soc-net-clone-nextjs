import { FC, useRef } from "react";
import { Button, Flex, FlexProps, Input } from "@chakra-ui/react";
import { Post as PostModel } from "@/models/Post";
import { useMutation } from "@datx/swr";
import { createComment } from "@/mutations/comments";
import { lorem } from "@/utils/lorem";
import { getPostComentsRelationshipPageKey } from "@/queries/posts";
import { mutate } from "swr";
import { unstable_serialize } from "swr/infinite";

export const CreateComment: FC<{ post: PostModel } & FlexProps> = ({ post, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const getKey = getPostComentsRelationshipPageKey(post.id);

  const [create, { status: createStatus }] = useMutation(createComment as any, {
    onSuccess: async () => {
      inputRef.current!.value = "";
      mutate(unstable_serialize(getKey));
    },
  });

  const randomComment = () => {
    if (inputRef.current) {
      inputRef.current.value = lorem(1);
      create({ post, body: inputRef.current.value });
    }
  };

  const comment = () => {
    if (inputRef.current?.value) {
      create({ post, body: inputRef.current.value });
    }
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
