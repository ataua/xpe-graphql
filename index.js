import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';

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
    author(id: ID!): Author
   }
`

const books = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: {
      id: 'a1',
      name: 'F. Scott Fitzgerald'
    }
  }, {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: {
      id: 'a2',
      name: 'Harper Lee'
    }
  }, {
    id: 3,
    title: '1984',
    author: {
      id: 'a3',
      name: 'George Orwell'
    }
  }, {
    id: 4,
    title: 'Pride and Prejudice',
    author: {
      id: 'a4',
      name: 'Jane Austen'
    }
  }, {
    id: 5,
    title: 'The Catcher in the Rye',
    author: {
      id: 'a5',
      name: 'J.D. Salinger'
    }
  }
]

const resolvers = {
  Query: {
    books: () => books,
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
