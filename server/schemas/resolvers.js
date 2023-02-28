const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { userId }) => {
            return User.findOne({ _id: userId });
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return Profile.findOne({ _id: context.user._id });
              }
              throw new AuthenticationError('You need to be logged in!');
        },
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create( username, email, password );
            const token = signToken(user);

            return { token, profile };
        },
        login: async(parent, {email, password}) => {
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
        saveBook: async (parent, { userId, savedBooks }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { savedBooks: savedBooks } },
                { new: true, runValidators: true }
              );
        },
        removeBook: async(parent, { savedBooks }, context) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: savedBooks } },
                { new: true }
              );
            
        }
    }
}