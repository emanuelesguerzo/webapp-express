// DATA
const connection = require('../data/db');

// INDEX
const index = (req, res, next) => {
    const filters = req.query;

    let sql = 'SELECT * FROM movies';
    const params = [];
    const conditions = [];

    if (filters.search) {
        conditions.push("title LIKE ?");
        params.push(`%${filters.search}%`);
    }

    if (filters.genre) {
        conditions.push("genre = ?");
        params.push(filters.genre);
    }

    if (filters.release_year) {
        conditions.push("release_year = ?");
        params.push(filters.release_year);
    }

    if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    connection.query(sql, params, (err, movies) => {
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
    const sql = 'SELECT * FROM movies WHERE id = ?;';
    const sqlReviews = `
    SELECT reviews.* 
    FROM reviews
    JOIN movies
    ON movies.id = reviews.movie_id
    WHERE movies.id = ?;`

    connection.query(sql, [id], (err, movies) => {

        if (err) return next(new Error("Internal Server Error"));

        if (movies.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Movie Not Found",
            });
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