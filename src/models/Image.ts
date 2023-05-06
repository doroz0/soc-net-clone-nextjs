import { Attribute, PureModel } from "@datx/core";
import { jsonapiModel } from "@datx/jsonapi";
import { User } from "./User";

export class Image extends jsonapiModel(PureModel) {
  public static readonly type = "images";

  @Attribute({ isIdentifier: true })
  id!: string;

  @Attribute()
  url!: string;

  @Attribute()
  created!: string;

  user!: User;
}
