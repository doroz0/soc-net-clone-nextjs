import { FC, useRef, useState } from "react";
import { Comment as CommentModel } from "@/models/Comment";
import { Button, CloseButton, Flex, IconButton, Input, Text, Textarea } from "@chakra-ui/react";
import { deleteComment, updateComment } from "@/mutations/comments";
import { mutate } from "swr";
import { getPostComentsRelationshipPageQuery } from "@/queries/posts";
import { useMutation } from "@datx/swr";
import { formatDistanceToNow } from "date-fns";
import { EditIcon } from "@chakra-ui/icons";

export const Comment: FC<{ comment: CommentModel }> = ({ comment }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setEditing] = useState(false);

  const [destroy] = useMutation(deleteComment as any, {
    onSuccess: async () => {
      mutate(getPostComentsRelationshipPageQuery(comment.post.id));
    },
  });

  const [update, { status: updateStatus }] = useMutation(updateComment as any, {
    onSuccess: async () => {
      setEditing(false);
      mutate(getPostComentsRelationshipPageQuery(comment.post.id));
    },
  });

  return (
    <Flex flexDir="column" w="full">
      <Flex p="4px" w="full" alignItems="center">
        {isEditing ? (
          <>
            <CloseButton color="red.500" onClick={() => destroy(comment.id)} />
            <Textarea ref={inputRef} defaultValue={comment.body} />
            <Button
              ml="auto"
              onClick={() => inputRef.current && update({ comment, body: inputRef.current.value })}
              isLoading={updateStatus === "running"}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Text>{comment.body}</Text>
            <IconButton ml="auto" icon={<EditIcon />} aria-label="Edit" onClick={() => setEditing(true)} />
          </>
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
