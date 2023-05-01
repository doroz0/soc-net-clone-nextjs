import { Post } from "@/models/Post";
import { updatePost } from "@/mutations/posts";
import { getPostQuery } from "@/queries/posts";
import { Button, HStack, Modal, Textarea } from "@chakra-ui/react";
import { ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useMutation } from "@datx/swr";
import { FC, useRef } from "react";
import { mutate } from "swr";

interface IEditPostModal {
  post: Post;
  onClose: () => void;
}

export const EditPostModal: FC<IEditPostModal> = ({ post, onClose }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [update, { status }] = useMutation(updatePost as any, {
    onSuccess: async () => {
      mutate(getPostQuery(post.id));
      onClose();
    },
  });

  const doUpdatePost = () => {
    if (inputRef.current?.value) {
      update({ post, body: inputRef.current.value });
    }
  };

  return (
    <Modal isOpen={!!post} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea ref={inputRef} defaultValue={post.body} />
        </ModalBody>

        <ModalFooter as={HStack}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={doUpdatePost}>Edit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
