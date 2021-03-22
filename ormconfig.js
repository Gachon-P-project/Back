{
    module.exports = {
        type: 'mariadb',
        host: process.env.host,
        port: process.env.port,
        username: process.env.user,
        password: process.env.password,
        database: process.env.database,
        synchronize: false,
        logging: false,
        entities: ['entities/*.ts'], 
    }
}