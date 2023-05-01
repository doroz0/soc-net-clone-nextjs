import { Attribute, PureModel } from "@datx/core";
import { jsonapiModel } from "@datx/jsonapi";
import { Post } from "./Post";
import { User } from "./User";

export class Comment extends jsonapiModel(PureModel) {
  public static readonly type = "comments";

  @Attribute({ isIdentifier: true })
  id!: string;

  @Attribute()
  body!: string;

  @Attribute()
  created!: string;

  @Attribute()
  modified!: string;

  post!: Post;

  user!: User;
}
