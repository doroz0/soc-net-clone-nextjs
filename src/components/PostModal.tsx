import { updatePost } from "@/mutations/posts";
import { getPostQuery } from "@/queries/posts";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useDatx, useMutation } from "@datx/swr";
import { format } from "date-fns";
import { FC, useRef } from "react";

interface IPostModal {
  id: string | null;
  onClose: () => void;
}

export const PostModal: FC<IPostModal> = ({ id, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: post, mutate } = useDatx(id ? getPostQuery(`${id}`) : null);

  // @ts-ignore
  const [update, { status }] = useMutation(updatePost, {
    onSuccess: async () => {
      mutate();
      onClose();
    },
  });

  if (!post) return null;

  return (
    <Modal isOpen={!!post} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {format(new Date(post?.data.modified || post?.data.created || 0), "yyyy-MM-dd HH:mm:ss")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input ref={inputRef} key={id} defaultValue={post?.data.body} />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => inputRef.current && update({ post: post.data, body: inputRef.current.value })}
          >
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
