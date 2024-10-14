const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class PostModel {
  static async getPostById(id) {
    return await database
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });
  }

  static async getAllPosts() {
    return await database.collection("posts").find().toArray();
  }

  static async createPost(content, tags, imgUrl, authorId) {
    const newPost = {
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(authorId),
      comments: [],
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    const result = await database.collection("posts").insertOne(newPost);
    return { _id: result.insertedId, ...newPost };
  }

  static async addComment(postId, content, authorId) {
    const user = await database
      .collection("users")
      .findOne({ _id: new ObjectId(authorId) });

    const comment = {
      username: user.username,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await database
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: comment } }
      );

    return await this.getPostById(postId);
  }

  static async likePost(postId, userId) {
    const user = await database
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    const username = user.username;

    const post = await database
      .collection("posts")
      .findOne({ _id: new ObjectId(postId) });

    if (!post) {
      throw new Error("Post not found.");
    }

    const alreadyLiked = post.likes.some(
      (like) => like.id.equals(user._id)
    );

    if (alreadyLiked) {
      // Unlike the post
      await database.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        { $pull: { likes: { id: user._id } } }
      );
    } else {
      // Like the post
      await database.collection("posts").updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: {
            likes: {
              id: user._id,
              username,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        }
      );
    }

    return await this.getPostById(postId);
  }
}

module.exports = PostModel;
