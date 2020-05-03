import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import env from 'dotenv';

import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models/index';
import { UserAPI, DeviceCategoryAPI, DeviceAPI, AssetAPI } from './datasources/index';

env.config();

const server = new ApolloServer({ 
    context : async ({ req }) => {
        return;
    },
    typeDefs, 
    resolvers, 
    playground: true,
    models,
    dataSources: () => ({
        UserAPI: new UserAPI({ models }),
        DeviceCategoryAPI: new DeviceCategoryAPI({ models }),
        DeviceAPI: new DeviceAPI({ models }),
        AssetAPI: new AssetAPI({ models }),
    }),
});

const app = express();

server.applyMiddleware({ app });

app.use(bodyParser.json());

models.sequelize.sync().then(() => {
    app.listen({ port: 4000 }, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    })
})

