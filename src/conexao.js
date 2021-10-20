const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'ec2-3-213-41-172.compute-1.amazonaws.com',
        port: 5432,
        user: 'aqpinujrpiucab',
        password: '24bec2944339018eda841a1e32f0b76d3902eaaacbe98f56dd37236e571ac7cc',
        database: 'dai7c6ul5dgdti',
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = knex;