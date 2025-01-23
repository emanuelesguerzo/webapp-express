// DATA
const connection = require('../data/db');

// INDEX
const index = (req, res, next) => {

    const sql = 'SELECT * FROM `movies`;'

    connection.query(sql, (err, movies) => {

        if (err) return next(new Error("Internal Server Error"));

        return res.status(200).json({
            status: 'success',
            data: movies,
        })

    })

}

// SHOW
const show = (req, res, next) => {

    const id = req.params.id;
    const sql = 'SELECT * FROM `movies` WHERE id = ?;';
    const sqlReviews = `
    SELECT reviews.* 
    FROM reviews
    JOIN movies
    ON movies.id = reviews.movie_id
    WHERE movies.id = ?;`

    connection.query(sql, [id], (err, movies) => {

        if (err) return next(new Error("Internal Server Error"));

        if (movies.length === 0) {
            const notFound = new Error(); 
            notFound.status = 404;
            return next(notFound); 
        }

        connection.query(sqlReviews, [id], (err, reviews) => {

            if (err) return next(new Error("Internal Server Error"));

            return res.status(200).json({
                status: 'success',
                data: {
                    ...movies[0],
                    reviews,
                }
            })

        })

    })

}

// EXPORT
module.exports = {
    index,
    show,
}