'use strict';

const Hapi = require('@hapi/hapi');

const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0'
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        request.logger.info('In handler %s', request.path);
        return 'Hello, world!';
    },
    config: {
      state: {
        parse: false, // parse and store in request.state
        failAction: 'ignore' // may also be 'ignore' or 'log'
      }
    }
});

const init = async () => {

     await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true,
            logEvents: ['response', 'onPostStart']
        }
    });


    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
