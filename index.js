import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import fs from 'fs/promises';

const typeDefs = gql`
   type Book {
    id: ID!
    title: String!
    author: Author!
   }

   type Author {
    id: ID!
    name: String!
    books: [Book!]!
   }

   type Query {
    books: [Book!]!
    authors: [Author!]!
    author(id: ID!): Author
   }

   type Mutation {
    addBook(title: String!, author: AuthorInput!): Book!
    updateBook(id: ID!, title: String!, author: AuthorInput!): Book!
   }

   input AuthorInput {
    id: ID!
    name: String!
   }
`

const source = JSON.parse(await fs.readFile('./books.json', 'utf8'))
const books = source.data
const authors = books.map(book => book.author)

const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors
  },
  Mutation: {
    addBook: async (parent, { title, author }) => {
      const newBook = { 
        id: books.length + 1, 
        title, 
        author: {
          id: author.id,
          name: author.name
        } 
      }
      books.push(newBook)
      await fs.writeFile('./books.json', JSON.stringify({ data: books }, null, 2), 'utf8')
      return newBook
    },
    updateBook: async (parent, { id, title, author }) => {
      const bookIndex = books.findIndex(book => String(book.id) === String(id))
      if (bookIndex === -1) {
        throw new Error('Book not found')
      }
      if(author !== undefined) {
        books[bookIndex].author = {...books[bookIndex].author, ...author}
      }
      if(title !== undefined) {
        books[bookIndex].title = title
      }
      await fs.writeFile('./books.json', JSON.stringify({ data: books }, null, 2), 'utf8')
      return books[bookIndex]
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const app = express();

app.use(express.json());

app.use(cors())

server.start().then(() => {
  server.applyMiddleware({ app })
  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
})
