import { User } from "@/models/User";
import { IGetOneExpression } from "@datx/swr";

export const getUserQuery = (id: string) =>
  ({
    id,
    op: "getOne",
    type: "users",
  } as const satisfies IGetOneExpression<typeof User>);
