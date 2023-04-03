import { Attribute, PureModel } from "@datx/core";
import { jsonapiModel } from "@datx/jsonapi";
import { Comment } from "./Comment";

export class Post extends jsonapiModel(PureModel) {
  public static readonly type = "posts";

  @Attribute({ isIdentifier: true })
  id!: string;

  @Attribute()
  body!: string;

  @Attribute()
  created!: string;

  @Attribute()
  modified!: string;

  comments!: Comment[];
}
