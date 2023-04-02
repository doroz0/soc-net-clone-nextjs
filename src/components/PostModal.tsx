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
import { useDatx } from "@datx/swr";
import { format } from "date-fns";
import { FC, useRef } from "react";

interface IPostModal {
  id: number | null;
  onClose: () => void;
}

export const PostModal: FC<IPostModal> = ({ id, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: post, mutate } = useDatx(id ? getPostQuery(`${id}`) : null);

  const edit = async () => {
    if (!inputRef.current?.value) return;

    await updatePost(post!.data, {
      body: inputRef.current.value,
    });

    await mutate();

    onClose();
  };

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
          <Button colorScheme="blue" mr={3} onClick={edit}>
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
