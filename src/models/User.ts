import { Attribute, PureModel } from "@datx/core";
import { jsonapiModel } from "@datx/jsonapi";
import { Comment } from "./Comment";
import { Post } from "./Post";
import { Image } from "./Image";

export class User extends jsonapiModel(PureModel) {
  public static readonly type = "users";

  @Attribute({ isIdentifier: true })
  id!: string;

  @Attribute()
  email!: string;

  @Attribute()
  username!: string;

  @Attribute()
  created!: string;

  comments!: Comment[];

  post!: Post[];

  images!: Image[];
}
