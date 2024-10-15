const { database } = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class FollowModel {

  static async findFollow({followingId, followerId}) {
    return await database.collection("follows").findOne({
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
    });
  }

  static async follow({followingId, followerId}) {
    const newFollow = {
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await database.collection("follows").insertOne(newFollow);
    return newFollow;
  }

  static async unfollow({followingId, followerId}) {
    await database.collection("follows").deleteOne({
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
    });
  }
}

module.exports = FollowModel;
