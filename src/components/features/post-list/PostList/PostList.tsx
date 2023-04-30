import { useDatx } from "@datx/swr";
import { VStack, StackProps } from "@chakra-ui/react";
import { postsQuery } from "@/queries/posts";
import { Post } from "@/components/features/post-list/Post/Post";
import { FC } from "react";

export const PostList: FC<StackProps> = ({ ...rest }) => {
  const { data: posts, error } = useDatx(postsQuery);

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <VStack spacing="24px" {...rest}>
      {posts?.data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </VStack>
  );
};
