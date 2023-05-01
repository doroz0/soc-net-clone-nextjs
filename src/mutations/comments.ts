import { getModelEndpointUrl, modelToJsonApi } from "@datx/jsonapi";
import { updateModel } from "@datx/core";
import { JsonapiSwrClient } from "@/datx/createClient";
import { Comment } from "@/models/Comment";
import { Post } from "@/models/Post";

export const createComment = (client: JsonapiSwrClient, { post, body }: { post: Post; body?: string }) => {
  const model = new Comment({ body, post }, client);
  const url = getModelEndpointUrl(model);
  const data = modelToJsonApi(model);
  delete data.relationships.user;

  return client.request<Comment>(url, "POST", { data });
};

export const updateComment = async (
  client: JsonapiSwrClient,
  { comment, body }: { comment: Comment; body: string }
) => {
  const data = modelToJsonApi(updateModel(comment, { body }), true);
  delete data.relationships;

  const url = getModelEndpointUrl(comment);
  return client.request<Comment>(url, "PATCH", { data });
};

export const deleteComment = (client: JsonapiSwrClient, id: string) => {
  return client.request(`comments/${id}`, "DELETE");
};
