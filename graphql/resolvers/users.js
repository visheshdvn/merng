const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "user not found";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    // Sign Up API
    async register(
      _,
      { registerInput: { username, password, confirmPassword, email } }
    ) {
      // TODO: Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", errors);
      }

      // make sure user does'nt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          error: "This username is taken",
        });
      }

      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
