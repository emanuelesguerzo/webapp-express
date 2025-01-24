const notFound = (req, res, err, next) => {
    res.status(404).json({
        status: "fail",
        message: err.message,
    })
}

module.exports = notFound;