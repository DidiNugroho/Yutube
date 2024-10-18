const { database } = require("../config/mongodb");
const { comparePassword } = require("../helpers/bcrypt");
const { ObjectId } = require("mongodb");

class UserModel {
  static async getUser(_id) {
    const agg = [
        { 
            $match: { _id: new ObjectId(_id) } 
        },
        //followers lookup
        {
            $lookup: {
                from: 'follows',
                localField: '_id',
                foreignField: 'followingId', 
                as: 'followers',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'followers.followerId', 
                foreignField: '_id', 
                as: 'followerDetails',
            },
        },
        //following lookup
        {
            $lookup: {
                from: 'follows',
                localField: '_id',
                foreignField: 'followerId', 
                as: 'following',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'following.followingId', 
                foreignField: '_id', 
                as: 'followingDetails',
            },
        },
        {
            $project: {
                _id: 1, 
                name: 1, 
                username: 1, 
                email: 1, 
                followers: {
                    $map: {
                        input: '$followerDetails',
                        as: 'follower',
                        in: {
                            _id: '$$follower._id',
                            username: '$$follower.username',
                            name: '$$follower.name',
                        }
                    }
                },
                following: {
                    $map: {
                        input: '$followingDetails',
                        as: 'followedUser',
                        in: {
                            _id: '$$followedUser._id',
                            username: '$$followedUser.username',
                            name: '$$followedUser.name',
                        }
                    }
                },
            },
        },
    ];
    
    const [user] = await database.collection("users").aggregate(agg).toArray();
    
    return user;
}


  static async getAllUsers() {
    const users = await database.collection("users").find().toArray();
    return users;
  }

  static async getUserByNameOrUsername(name, username, loggedUserId) {
    const query = {
      $or: []
    };

    if (loggedUserId) {
      query.$and = [{ _id: { $ne: new ObjectId(loggedUserId) } }];
    }

    if (name) {
      query.$or.push({ name: { $regex: name, $options: 'i' } }); 
    }
    
    if (username) {
      query.$or.push({ username: { $regex: username, $options: 'i' } }); 
    }

    if (query.$or.length > 0) {
      const user = await database.collection("users").findOne(query);
      return user; 
    }
    
    return null;
  }
  


  static async register(newUser) {
    const result = await database.collection("users").insertOne(newUser);
    return result;
  }

  static async login(email, password) {
    const user = await database.collection("users").findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    return user;
  }
}

module.exports = UserModel;
