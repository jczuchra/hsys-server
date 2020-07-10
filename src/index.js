import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import env from 'dotenv';
import express from 'express';
import {
  AssetAPI,
  DeviceAPI,
  DeviceCategoryAPI,
  UserAPI,
} from './datasources/index';
import models from './models/index';
import resolvers from './resolvers';
import { validateTokens } from './utils/tokens';
import typeDefs from './schema';

env.config();

const server = new ApolloServer({
  context: async ({ req, res }) => {
    await validateTokens(req, res, models);
    return { req, res };
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

const whitelist = [
  'https://hsys-server.herokuapp.com',
  'https://hsys-client.herokuapp.com',
  'http://localhost:3000',
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Origin', origin);

    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(cookieParser());

app.use((req, _, next) => {
  const refreshToken = req.cookies['refresh-token'];
  const accessToken = req.cookies['access-token'];
  if (!refreshToken && !accessToken) {
    return next();
  }

  try {
    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = data.userId;
  } catch {}
  next();
});

app.use(express.static('public'));

app.get('/', cors(corsOptions), function (req, res) {
  res.render('index.html');
});

server.applyMiddleware({ app, cors: false });

models.sequelize.sync().then(() => {
  app.listen({ port: process.env.PORT || 4000 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
});
