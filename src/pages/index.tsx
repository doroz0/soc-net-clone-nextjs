import { Layout } from "@/components/shared/layouts/Layout/Layout";
import { Button, Center, Heading } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <Center flexDirection="column">
        <Heading>Nothing to see here</Heading>
        <Button as={Link} mt="24px" href="/posts">
          Go to /posts
        </Button>
      </Center>
    </Layout>
  );
}
