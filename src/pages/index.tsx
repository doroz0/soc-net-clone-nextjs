import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  return null;
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
    redirect: {
      permanent: false,
      destination: "/posts",
    },
  };
};
