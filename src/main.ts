import express from 'express';
import drinkRoutes from './controllers/drinks/routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use('/drinks', drinkRoutes);

app.listen(PORT, () => {
    console.log(`Server na Porta ${PORT}`);
});

export default app;