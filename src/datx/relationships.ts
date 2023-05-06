import { Comment } from "@/models/Comment";
import { Image } from "@/models/Image";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { Attribute } from "@datx/core";

// User
Attribute({ toMany: Post })(User, "post");
Attribute({ toMany: Comment })(User, "comments");
Attribute({ toMany: Image })(User, "images");

// Post
Attribute({ toOne: User })(Post, "user");
Attribute({ toMany: Comment })(Post, "comments");
Attribute({ toMany: Image })(Post, "images");

// Comment
Attribute({ toOne: User })(Comment, "user");
Attribute({ toOne: Post })(Comment, "post");

// Image
Attribute({ toOne: User })(Image, "user");
