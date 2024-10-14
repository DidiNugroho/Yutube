// models/PostModel.js
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
    const comment = {
      id: new ObjectId(),
      content,
      authorId: new ObjectId(authorId),
      createdAt: new Date().toISOString(),
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
    // Convert postId to ObjectId
    const post = await database
      .collection("posts")
      .findOne({ _id: new ObjectId(postId) });

    if (!post) {
      throw new Error("Post not found.");
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      await database
        .collection("posts")
        .updateOne({ _id: new ObjectId(postId) }, { $pull: { likes: userId } });
    } else {
      await database
        .collection("posts")
        .updateOne(
          { _id: new ObjectId(postId) },
          { $addToSet: { likes: userId } }
        );
    }

    return await database
      .collection("posts")
      .findOne({ _id: new ObjectId(postId) });
  }
  
}

module.exports = PostModel;
