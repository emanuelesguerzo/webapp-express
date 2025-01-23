// DATA
const express = require('express');
const moviesRouter = require('./routers/movies');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const port = process.env.SERVER_PORT;

// STATIC
app.use(express.static('public'));

// ROUTES
app.use('/movies', moviesRouter);

// MIDDLEWARES
app.use(errorHandler);

// LISTEN
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})