import dotenv from "dotenv";
import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageProductionDefault } from "apollo-server-core";
import { getApp, getUser } from "./firebase.js";
import IContext from "./context.js";
import Logger from "./logger.js";

dotenv.config();

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }
    type Query {
        books: [Book]
    }
`;

const books = [
    {
        title: "The Awakening",
        author: "Kate Chopin",
    },
    {
        title: "City of Glass",
        author: "Paul Auster",
    },
];

const resolvers = {
    Query: {
        books: () => books,
    },
};

const context = async (ctx: any): Promise<IContext> => {
    return {
        appId: await getApp(ctx.req),
        userId: await getUser(ctx.req),
        ip: ctx.req.hostname
    };
};

const landingPage = ApolloServerPluginLandingPageProductionDefault({ 
    footer: false
});

const logger = new Logger();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    context,
    introspection: true,
    plugins: [ landingPage, logger ],
});


await server.listen({
    port: process.env.PORT,      
});
