const connection = require('../data/db');

const index = (req, res) => {

    const sql = "SELECT * FROM `movies`;"

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

const show = () => {
    
}

module.exports = {
    index,
    show,
}