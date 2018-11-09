const Hapi = require('hapi');

const routes = require('./routes');

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    app: {}
});

const initServer = async () => {
    try {
        await server.register(routes);

        // await dbService.init()

        await server.start();
        console.log(`Server running: ${server.info.uri}`);
    } catch (error) {
        console.log('Error in running');
    }
};

initServer();