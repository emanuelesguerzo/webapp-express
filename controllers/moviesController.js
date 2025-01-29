// DATA
const connection = require('../data/db');
const slugify = require('slugify');

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

    const slug = req.params.slug;

    const sql = `
    SELECT movies.*, ROUND(AVG(reviews.vote), 1) as vote_avg
    FROM movies
    LEFT JOIN reviews
    ON reviews.movie_id = movies.id
    WHERE movies.slug = ?
   `;

    const sqlReviews = `
    SELECT reviews.* 
    FROM reviews
    JOIN movies
    ON movies.id = reviews.movie_id
    WHERE movies.slug = ?;`

    connection.query(sql, [slug], (err, movies) => {

        if (err) return next(new Error("Internal Server Error"));

        if (movies.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Movie Not Found",
            });
        }

        connection.query(sqlReviews, [slug], (err, reviews) => {

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

const storeReview = (req, res, next) => {

    const slug = req.params.slug;
    const { name, vote, text } = req.body;

    // Username Validation
    if (name.length <= 3) {

        return res.status(400).json({
            status: "fail",
            message: "Name should be at least 4 characters long"
        })

    }

    // Vote Validation
    if (isNaN(vote) || vote < 0 || vote > 5) {

        return res.status(400).json({
            status: "fail",
            message: "The vote must be a number between 0 and 5"
        })

    }

    // Comment Validation
    if (text && text.length > 0 && text.length < 5) {

        return res.status(400).json({
            status: "fail",
            message: "Text should be at least 6 characters long"
        })

    }

    const movieSql = `
    SELECT *
    FROM movies
    WHERE slug = ?
    `;

    connection.query(movieSql, [slug], (err, results) => {

        if (err) {
            return next(new Error("Internal Server Error"));
        }

        if (results.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Movie not found"
            })
        }

        const movieId = results[0].id;

        const sql = `
        INSERT INTO reviews(movie_id, name, vote, text)
        VALUES(?, ?, ?, ?);
        `;

        connection.query(sql, [movieId, name, vote, text], (err, results) => {

            if (err) {
                return next(new Error("Database query failed"))
            }

            res.status(201).json({
                status: "success",
                message: "Review successfully added"
            })

        })

    })

}

const store = (req, res, next) => {

    const imageName = req.file.filename;
    const { title, director, genre, release_year, abstract } = req.body;

    // File Validation
    if (!req.file || !req.file.filename) {
        return res.status(400).json({
            status: "fail",
            message: "An image is required"
        });
    }

    // Title Validation
    if (!title || title.length < 2) {
        return res.status(400).json({
            status: "fail",
            message: "Title should be at least 2 characters long"
        });
    }

    // Director Validation
    if (!director || director.length < 3) {
        return res.status(400).json({
            status: "fail",
            message: "Director name should be at least 3 characters long"
        });
    }

    // Genre Validation
    if (!genre || genre.length < 3) {
        return res.status(400).json({
            status: "fail",
            message: "Genre should be at least 3 characters long"
        });
    }

    // Release Year Validation
    const currentYear = new Date().getFullYear();
    if (!release_year || isNaN(release_year) || release_year > currentYear) {
        return res.status(400).json({
            status: "fail",
            message: `Release year must be a number between 1895 and ${currentYear}`
        });
    }

    // Abstract Validation
    if (abstract && abstract.length > 0 && abstract.length < 10) {
        return res.status(400).json({
            status: "fail",
            message: "Abstract should be at least 10 characters long"
        });
    }

    const slug = slugify(title, {
        lower: true, 
        strict: true,
    })

    const sql = `
    INSERT INTO movies(slug, title, director, genre, release_year, abstract, image)
    VALUES(?, ?, ?, ?, ?, ?, ?);
    `;

    connection.query(sql, [slug, title, director, genre, release_year, abstract, imageName], (err, results) => {
        
        if (err) {
            return next(new Error("Internal Server Error"))
        }

        return res.status(201).json({
            status: "success",
            message: "Saved successfully!",
        })

    })

}

// EXPORT
module.exports = {
    index,
    show,
    storeReview,
    store,
}