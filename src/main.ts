import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { PrismaClient } from '@prisma/client';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

// Inicialização do Prisma
const prisma = new PrismaClient();

// Inicialização do Express
const app: Express = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use(routes);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Inicialização do servidor
const PORT = config.server.port;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Conexão com o banco de dados
prisma.$connect()
  .then(() => {
    console.log('Conectado ao banco de dados');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  });

// Exportação para testes
export default app;
