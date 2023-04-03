import { Collection } from "@datx/core";
import { CachingStrategy, config } from "@datx/jsonapi";
import { jsonapiSwrClient } from "@datx/swr";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";

export class JsonapiSwrClient extends jsonapiSwrClient(Collection) {
  public static types = [Post, Comment];
}

export function createClient() {
  config.baseUrl = "https://socnetcloneapi20230402183653.azurewebsites.net/";
  // config.baseUrl = "http://localhost:7228/";
  config.cache = CachingStrategy.NetworkOnly;
  const client = new JsonapiSwrClient();
  return client;
}

export type Client = typeof JsonapiSwrClient;
