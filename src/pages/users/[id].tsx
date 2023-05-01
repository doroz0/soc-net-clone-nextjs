import { PostList } from "@/components/features/post-list/PostList/PostList";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { Layout } from "@/components/shared/layouts/Layout/Layout";

export default function UserPage() {
  const { query } = useRouter();
  const id = query?.id as string;

  return (
    <Layout>
      <PostList filterByUserId={id} mt="24px" />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {},
  };
};
