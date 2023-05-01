import { formatDistanceToNow as fstn } from "date-fns";

export const formatDistanceToNow = (date: string) => fstn(new Date(date), { includeSeconds: true, addSuffix: true });
