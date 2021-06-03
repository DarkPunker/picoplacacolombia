const { /* Pool, */ Client } = require('pg')

let client = new Client({
    user: 'erggnakfnkygpe',
    password: '774483fe937288c2399bec4c6ca0f552b38651e54ae758b7bb71b33439d396fc',
    database: 'df0pn6ilfsd9cm',
    port: 5432,
    host: 'ec2-34-233-0-64.compute-1.amazonaws.com',
    ssl: {
      rejectUnauthorized: false
    },
})
client.connect()


module.exports = client;