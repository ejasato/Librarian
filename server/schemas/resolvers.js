const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-_v -password"
        );

        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      console.log('mut')
      const user = await User.create({ username, password, email })
      const token = signToken(user)
      return { user, token }
  },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ $or: [{ username }, { email }] });

      if (!user) {
        throw new AuthenticationError('No profile with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { userId, book }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
    },
    removeBook: async (parent, { bookId }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );

    },
  }
};

module.exports =  resolvers;