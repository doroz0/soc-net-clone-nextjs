import { Attribute, PureModel } from "@datx/core";
import { jsonapiModel } from "@datx/jsonapi";
import { Post } from "./Post";

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

  @Attribute({ toOne: Post })
  post!: Post;
}

Attribute({ toMany: Comment })(Post, "comments");
