import { getModelEndpointUrl, modelToJsonApi } from "@datx/jsonapi";
import { Post } from "../models/Post";
import { updateModel } from "@datx/core";
import { JsonapiSwrClient } from "@/datx/createClient";

export const createPost = (client: JsonapiSwrClient, body?: string) => {
  const model = new Post({ body });
  const url = getModelEndpointUrl(model);
  const data = modelToJsonApi(model);

  return client.request<Post>(url, "POST", { data });
};

export const updatePost = (post: Post, data: any) => updateModel(post, data).save();

export const deletePost = (client: JsonapiSwrClient, id: string) => {
  return client.request(`posts/${id}`, "DELETE");
};
