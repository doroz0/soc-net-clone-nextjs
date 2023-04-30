import { Center, Flex } from "@chakra-ui/react";
import { PostList } from "@/components/features/post-list/PostList/PostList";
import { PostCreator } from "@/components/features/post-list/CreatePost/CreatePost";

export default function Posts() {
  return (
    <Center mx="auto" maxW="768px">
      <Flex p="24px" flexDir="column" justifyContent="flex-start">
        <PostCreator mt="24px" />
        <PostList mt="24px" />
      </Flex>
    </Center>
  );
}
