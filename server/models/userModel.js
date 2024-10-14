const { database } = require("../config/mongodb");
const { comparePassword } = require("../helpers/bcrypt");
const { ObjectId } = require("mongodb");


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

  static async getUserByNameOrUsername(name, username) {
    if(name && !username) {
      const users = await database.collection("users").findOne({ name });
      return users;
    } else if (!name && username) {
      const users = await database.collection("users").findOne({ username });
      return users;
    } else if (name && username) {
      return await database.collection("users").findOne({
        $or: [{ name }, { username }] // Fetches user if either name or username matches
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
