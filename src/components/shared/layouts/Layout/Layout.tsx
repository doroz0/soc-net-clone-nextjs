import { FC, ReactNode } from "react";
import { Container } from "@chakra-ui/react";
import { TopNavBar } from "../../navigation/TopNavBar/TopNavBar";

interface ILayout {
  children?: ReactNode;
}

export const Layout: FC<ILayout> = ({ children }) => {
  return (
    <>
      <TopNavBar />
      <Container maxW="768px" p="24px" flexDirection="column">
        {children}
      </Container>
    </>
  );
};
