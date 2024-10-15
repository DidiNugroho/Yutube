const { database } = require("../config/mongodb");
const { comparePassword } = require("../helpers/bcrypt");
const { ObjectId } = require("mongodb");


class UserModel {
  static async getUser(_id) {
    const agg = [
        { 
            $match: { _id: new ObjectId(_id) } 
        },
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

  static async getUserByNameOrUsername(name, username) {
    if(name && !username) {
      const users = await database.collection("users").findOne({ name });
      return users;
    } else if (!name && username) {
      const users = await database.collection("users").findOne({ username });
      return users;
    } else if (name && username) {
      return await database.collection("users").findOne({
        $or: [{ name }, { username }] 
      });
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
