import { JsonapiSwrClient } from "@/datx/createClient";
import { Image } from "@/models/Image";

export const uploadImage = (client: JsonapiSwrClient, data: { blob: string }) => {
  return client.request<Image>("images/upload", "UPLOAD", data);
};
