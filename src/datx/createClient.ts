import { Collection } from "@datx/core";
import { CachingStrategy, ICollectionFetchOpts, config } from "@datx/jsonapi";
import { jsonapiSwrClient } from "@datx/swr";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";

export class JsonapiSwrClient extends jsonapiSwrClient(Collection) {
  public static types = [Post, Comment];
}

export function createClient() {
  config.baseUrl = "http://localhost:7228/";
  config.transformRequest = (options: ICollectionFetchOpts) => {
    if (options.url.includes("?")) {
      const queryParams = options.url.split("?")[1];

      const qp1 = queryParams.slice(0, Math.floor(queryParams.length / 2));
      const qp2 = queryParams.slice(Math.ceil(queryParams.length / 2));

      if (qp1 === qp2) {
        options.url = `${options.url.split("?")[0]}?${qp1}`;
      }
    }

    return options;
  };
  config.cache = CachingStrategy.NetworkOnly;
  const client = new JsonapiSwrClient();
  return client;
}

export type Client = typeof JsonapiSwrClient;
