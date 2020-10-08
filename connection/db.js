const connection = require('mysql2')

const conn = connection.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'realtime_app'
})

module.exports = conn 


