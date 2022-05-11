const { ApolloServer, gql } = require('apollo-server');
const mongoose  = require('mongoose');
require('dotenv').config();

const URI = process.env.DB_URI 

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

  type Query {
    sayHi: String!
  }
`;

const resolvers = {
    Query:{
        sayHi:()=>"hello"
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
  });

  mongoose.connect(URI,{
    useNewUrlParser:true
  }).then(()=>{
    console.log("Database is ok!")
  })
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });