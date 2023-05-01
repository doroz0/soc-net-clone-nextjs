import { useDatx } from "@datx/swr";
import { VStack, StackProps } from "@chakra-ui/react";
import { getPostsQuery } from "@/queries/posts";
import { Post } from "@/components/features/post-list/Post/Post";
import { FC } from "react";

interface IPostList {
  filterByUserId?: string;
}

export const PostList: FC<IPostList & StackProps> = ({ filterByUserId, ...rest }) => {
  const { data: posts, error } = useDatx(getPostsQuery(filterByUserId));

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
