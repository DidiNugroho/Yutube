const { database } = require("../config/mongodb");
const { ObjectId } = require("mongodb");

class FollowModel {

  static async getFollowers(userId) {
    return await database
      .collection("follows")
      .aggregate([
        { $match: { followingId: new ObjectId(userId) } },
        {
          '$lookup': {
            'from': 'users', 
            'localField': 'followerId', 
            'foreignField': '_id', 
            'as': 'userData'
          }
        }, {
          '$unwind': {
            'path': '$userData'
          }
        }, {
          '$project': {
            'userData.password': 0,
            'userData.email': 0
          }
        }, {
          '$sort': {
            'createdAt': -1
          }
        }
      ])
      .toArray();
  }

  static async getFollowing(userId) {
    return await database
      .collection("follows")
      .aggregate([
        { $match: { followerId: new ObjectId(userId) } },
        {
          '$lookup': {
            'from': 'users', 
            'localField': 'followingId', 
            'foreignField': '_id', 
            'as': 'userData'
          }
        }, {
          '$unwind': {
            'path': '$userData'
          }
        }, {
          '$project': {
            'userData.password': 0,
            'userData.email': 0
          }
        }, {
          '$sort': {
            'createdAt': -1
          }
        }
      ])
      .toArray();
  }

  static async findFollow(followingId, followerId) {
    return await database.collection("follows").findOne({
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
    });
  }

  static async follow(followingId, followerId) {
    const newFollow = {
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await database.collection("follows").insertOne(newFollow);
    return newFollow;
  }

  static async unfollow(followingId, followerId) {
    await database.collection("follows").deleteOne({
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
    });
  }
}

module.exports = FollowModel;
