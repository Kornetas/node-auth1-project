/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
const db = require("../../data/db-config");

async function find() {
  const result = await db("users").select("user_id", "username");
  return result;
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(username) {
  const result = await db("users")
    .select("user_id", "username")
    .where("username", username)
    .first();
  return result;
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  const result = await db("users")
    .select("user_id", "username")
    .where("user_id", user_id);
  return result;
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
  await db("users").insert(user);
  const newUser = await db("users")
    .select("user_id", "username")
    .where("username", user.username)
    .first();
  return newUser;
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add,
};
