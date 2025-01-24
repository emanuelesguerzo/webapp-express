// DATA
const express = require('express');
const moviesRouter = require('./routers/movies');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound')
const app = express();
const port = process.env.SERVER_PORT;
const cors = require('cors');

// MIDDLEWARE CORS
app.use(cors({
    origin: process.env.FRONTEND_URL
}))

// STATIC
app.use(express.static('public'));

// ROUTES
app.use('/movies', moviesRouter);

// MIDDLEWARES
app.use(errorHandler);

app.use(notFound);

// LISTEN
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})