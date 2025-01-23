const connection = require('../data/db');

// INDEX
const index = (req, res) => {

    const sql = 'SELECT * FROM `movies`;'

    connection.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            })
        } else {
            return res.status(200).json({
                status: 'success',
                data: results,
            })
        }

    })
}

// SHOW
const show = (req, res) => {

    const id = req.params.id;
    const sql = 'SELECT * FROM `movies` WHERE id = ?;';
    const sqlReviews = `
    SELECT reviews.* 
    FROM reviews
    JOIN movies
    ON movies.id = reviews.movie_id
    WHERE movies.id = ?;`

    connection.query(sql, [id], (err, movies) => {

        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            })
        }

        if (movies.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Movie Not Found",
            });
        }

        connection.query(sqlReviews, [id], (err, reviews) => {

            if (err) {
                return res.status(500).json({
                    message: 'Internal Server Error'
                })
            } else {
                return res.status(200).json({
                    status: 'success',
                    data: {
                        ...movies[0],
                        reviews,
                    }
                })
            }

        })
        
    })

}

module.exports = {
    index,
    show,
}