import { FC, useRef, useState } from "react";
import { Comment as CommentModel } from "@/models/Comment";
import { Button, ButtonGroup, Center, Flex, IconButton, Text, Textarea } from "@chakra-ui/react";
import { deleteComment, updateComment } from "@/mutations/comments";
import { mutate } from "swr";
import { getPostComentsRelationshipPageKey } from "@/queries/posts";
import { useMutation } from "@datx/swr";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { unstable_serialize } from "swr/infinite";
import { formatDistanceToNow } from "@/utils/dates";

export const Comment: FC<{ comment: CommentModel }> = ({ comment }) => {
  const { data: session } = useSession();
  const hasOwnership = session?.user.id === comment.user.id;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setEditing] = useState(false);

  const getKey = getPostComentsRelationshipPageKey(comment.post.id);

  const [destroy] = useMutation(deleteComment as any, {
    onSuccess: async () => {
      mutate(unstable_serialize(getKey));
    },
  });

  const [update, { status: updateStatus }] = useMutation(updateComment as any, {
    onSuccess: async () => {
      setEditing(false);
      mutate(unstable_serialize(getKey));
    },
  });

  const toggleEditMode = () => setEditing((e) => !e);
  const destroyComment = () => destroy(comment.id);
  const doUpdateComment = () => {
    if (inputRef.current?.value) {
      update({ comment, body: inputRef.current.value });
    }
  };

  return (
    <Flex flexDir="column" w="full" px={{ base: "0", md: "24px" }}>
      <Center justifyContent="space-between">
        <Text fontWeight="bold">{`${comment.user.username}${hasOwnership ? " (You)" : ""}`}</Text>
        {hasOwnership && !isEditing && (
          <ButtonGroup size="sm">
            <IconButton icon={<EditIcon />} aria-label="Edit" onClick={toggleEditMode} />
            <IconButton icon={<CloseIcon />} aria-label="Delete" color="red.500" onClick={destroyComment} />
          </ButtonGroup>
        )}
      </Center>

      {!isEditing ? (
        <>
          <Text>{comment.body}</Text>
          <Text fontSize="12px" ml="auto">
            {comment.modified ? "Edited: " : ""}
            {formatDistanceToNow(comment.modified || comment.created)}
          </Text>
        </>
      ) : (
        <>
          <Textarea ref={inputRef} defaultValue={comment.body} key={`${isEditing}`} />
          <Flex ml="auto" mt="4px">
            <Button onClick={toggleEditMode}>Cancel</Button>
            <Button onClick={doUpdateComment} isLoading={updateStatus === "running"}>
              Save
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};
