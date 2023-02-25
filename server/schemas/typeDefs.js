const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: String
    savedBooks: [String]!
  }
  
  type Book {
    bookId: String!
    authors: [String]!
    description: String
    title: String
    image: String
    link: String
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

    saveBook(userId: ID!, bookId: String!, authors: [String]!, title: String!, description: String!, image: String!): User

    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;