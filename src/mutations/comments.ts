import { getModelEndpointUrl, modelToJsonApi } from "@datx/jsonapi";
import { updateModel } from "@datx/core";
import { JsonapiSwrClient } from "@/datx/createClient";
import { Comment } from "@/models/Comment";
import { Post } from "@/models/Post";

export const createComment = (client: JsonapiSwrClient, { post, body }: { post: Post; body?: string }) => {
  const model = new Comment({ body, post }, client);
  const url = getModelEndpointUrl(model);
  const data = modelToJsonApi(model);

  return client.request<Comment>(url, "POST", { data });
};

export const updateComment = (comment: Comment, data: any) => updateModel(comment, data).save();

export const deleteComment = (client: JsonapiSwrClient, id: string) => {
  return client.request(`comments/${id}`, "DELETE");
};
