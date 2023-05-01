import { Comment } from "@/models/Comment";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { Attribute } from "@datx/core";

// User
Attribute({ toMany: Post })(User, "post");
Attribute({ toMany: Comment })(User, "comments");

// Post
Attribute({ toOne: User })(Post, "user");
Attribute({ toMany: Comment })(Post, "comments");

// Comment
Attribute({ toOne: User })(Comment, "user");
Attribute({ toOne: Post })(Comment, "post");
