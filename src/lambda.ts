import { APIGatewayProxyHandler } from "aws-lambda";
import serverlessExpress from '@vendia/serverless-express';
import express from 'express';
import drinkRoutes from './routes/drinkRoutes';

const app = express();
app.use(express.json());
app.use('/', drinkRoutes);

export const handler: APIGatewayProxyHandler = serverlessExpress({ app });