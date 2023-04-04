import { getModelEndpointUrl, modelToJsonApi } from "@datx/jsonapi";
import { Post } from "../models/Post";
import { updateModel } from "@datx/core";
import { JsonapiSwrClient } from "@/datx/createClient";

export const createPost = (client: JsonapiSwrClient, body: string) => {
  const model = new Post({ body });
  const url = getModelEndpointUrl(model);
  const data = modelToJsonApi(model);

  return client.request<Post>(url, "POST", { data });
};

export const updatePost = async (client: JsonapiSwrClient, { post, body }: { post: Post; body: string }) => {
  const data = modelToJsonApi(updateModel(post, { body }), true);
  delete data.relationships;

  const url = getModelEndpointUrl(post);
  return client.request<Post>(url, "PATCH", { data });
};

export const deletePost = (client: JsonapiSwrClient, id: string) => {
  return client.request(`posts/${id}`, "DELETE");
};
