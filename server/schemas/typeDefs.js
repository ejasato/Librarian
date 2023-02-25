const { gql } = require('apollo-server-express');

const typeDefs = gql`
  user Profile {
    _id: ID
    username: String
    email: String
    bookCount: String
    savedBooks: [String]!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [user]!
    user(userId: ID!): User
    # Because we have the context functionality in place to check a JWT and decode its data, we can use a query that will always find and return the logged in user's data
    me: user
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    saveBook(profileId: ID!, skill: String!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;