import { FC } from "react";
import { Button, ButtonGroup, Center, Heading, IconButton, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { routes } from "@/consts/routes";
import { useDatx } from "@datx/swr";
import { getUserQuery } from "@/queries/users";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const TopNavBar: FC = () => {
  const { push, route, query } = useRouter();
  const { data: session, status } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();

  const { data: user } = useDatx(route === "/users/[id]" && query?.id ? getUserQuery(query!.id as string) : null);

  return (
    <Center h="40px" p="24px" bg="facebook.300">
      <Heading pos="absolute" left="24px" size="lg" hideBelow="sm">
        <Link href="/">SocNetClone</Link>
      </Heading>

      <Heading size="md" mr={{ base: "auto", sm: "unset" }}>
        {user ? `${user.data.username}${session?.user.id === user.data.id ? " (You)" : ""}` : routes[route]}
      </Heading>

      <ButtonGroup pos="absolute" right="24px" variant="ghost">
        <IconButton
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          aria-label="Change color mode"
          onClick={toggleColorMode}
        />
        {status === "authenticated" && <Button onClick={() => push("/logout")}>Logout</Button>}
        {status === "unauthenticated" && <Button onClick={() => push("/login")}>Login</Button>}
      </ButtonGroup>
    </Center>
  );
};
