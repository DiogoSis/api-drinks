import express from 'express';
import drinkRoutes from './routes/drinkRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', drinkRoutes);

app.listen(PORT, () => {
    console.log(`Server na Porta ${PORT}`);
});