import { Collection } from "@datx/core";
import { CachingStrategy, config } from "@datx/jsonapi";
import { jsonapiSwrClient } from "@datx/swr";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { User } from "@/models/User";
import { signIn } from "next-auth/react";

import "./relationships";

export class JsonapiSwrClient extends jsonapiSwrClient(Collection) {
  public static types = [Post, Comment, User];
}

export function createClient() {
  config.baseUrl = `${process.env.NEXT_PUBLIC_API_URL!}/`;
  config.cache = CachingStrategy.NetworkOnly;

  config.transformRequest = (options) => {
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

  // TODO: There has to be a better way
  config.onError = (res) => {
    if (res.status === 401 && typeof window !== "undefined") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`).then(({ status }) => {
        if (status === 401) signIn("custom");
      });
    }
    return res;
  };

  return new JsonapiSwrClient();
}

export type Client = typeof JsonapiSwrClient;
