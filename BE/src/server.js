const fastify = require('fastify')({ logger: true });
const routes = require('./routes');

fastify.register(require('@fastify/cors'), {
  origin: true,
  credentials: true,
});

fastify.register(require('@fastify/jwt'), { secret: 'dev-secret' });

fastify.register(routes);

const port = process.env.PORT || 3001;
fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});


