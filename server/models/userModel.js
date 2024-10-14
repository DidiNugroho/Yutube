const { database } = require("../config/mongodb");

class UserModel {
  static async getUser(_id) {
    const user = await database
      .collection("users")
      .findOne({ _id: new ObjectId(_id) });
    return user;
  }

  static async getAllUsers() {
    const users = await database.collection("users").find().toArray();
    return users;
  }

  static async register(newUser) {
    const result = await database.collection("users").insertOne(newUser);
    return result;
  }
}

module.exports = UserModel;
