import { FC, useRef, useState } from "react";
import { Comment as CommentModel } from "@/models/Comment";
import { Button, CloseButton, Flex, Input, Text } from "@chakra-ui/react";
import { deleteComment, updateComment } from "@/mutations/comments";
import { mutate } from "swr";
import { getPostComentsRelationshipQuery } from "@/queries/posts";
import { useMutation } from "@datx/swr";
import { formatDistanceToNow } from "date-fns";

export const Comment: FC<{ comment: CommentModel }> = ({ comment }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasChanged, setChanged] = useState(false);

  const [destroy] = useMutation(deleteComment as any, {
    onSuccess: async () => {
      mutate(getPostComentsRelationshipQuery(comment.post.id));
    },
  });

  const [update, { status: updateStatus }] = useMutation(updateComment as any, {
    onSuccess: async () => {
      mutate(getPostComentsRelationshipQuery(comment.post.id));
    },
  });

  return (
    <Flex flexDir="column" w="full">
      <Flex p="4px" w="full" alignItems="center">
        <CloseButton color="red.500" onClick={() => destroy(comment.id)} />
        <Input ref={inputRef} defaultValue={comment.body} onChange={() => setChanged(true)} />
        {hasChanged && (
          <Button
            variant="link"
            ml="auto"
            onClick={() => inputRef.current && update({ comment, body: inputRef.current.value })}
            isLoading={updateStatus === "running"}
          >
            Edit
          </Button>
        )}
      </Flex>
      <Flex fontSize="12px" justifyContent="flex-end">
        <Text>
          {comment.modified ? "Edited: " : ""}
          {formatDistanceToNow(new Date(comment.modified || comment.created), {
            includeSeconds: true,
            addSuffix: true,
          })}
        </Text>
      </Flex>
    </Flex>
  );
};
