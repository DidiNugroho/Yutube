const { ObjectId } = require("mongodb");

function isValidObjectId(id) {
  return ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;
}

module.exports = { isValidObjectId };