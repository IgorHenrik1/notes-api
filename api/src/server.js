require('express-async-errors');
const migrationsRun = require('./database/sqlite/migrations');

const AppError = require('./utils/AppError');

//importando o express
const express = require('express');

const routes = require('./routes');

//inicializando o express
const app = express();
//dizendo o formato/padrao que vamos receber os dados atraves do corpo da requisição
app.use(express.json());

app.use(routes);

migrationsRun();

app.use((error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
    }

    console.error(error);

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});
//definindo uma porta para ser observada e esperando requisições
const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
