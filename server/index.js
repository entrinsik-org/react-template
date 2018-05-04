const hapi = require('hapi');
const path = require('path');
const fs = require('fs');

const server = hapi.server({ port: 3002 });

const auth = `Basic ${Buffer.from('admin:123').toString('base64')}`;

const mapInformerRequest = path => req => ({
  uri: `http://localhost:4000${path}/${req.params.p}${req.url.search}`,
  headers: {
    Authorization: auth
  }
});

async function init() {
  await server.register({ plugin: require('h2o2') });
  await server.register({ plugin: require('inert') });

  server.route({
    method: 'get',
    path: '/v/{p*}',
    handler: {
      proxy: {
        xforward: true,
        passThrough: true,
        mapUri: mapInformerRequest('/v'),
        ttl: 'upstream'
      }
    }
  });

  server.route({
    method: ['get', 'post'],
    path: '/api/{p*}',
    handler: {
      proxy: {
        xforward: true,
        passThrough: true,
        mapUri: mapInformerRequest('/api'),
        ttl: 'upstream'
      }
    }
  });

  // server.route({
  //   method: 'get',
  //   path: '/{p*}',
  //   handler: function(req, h) {
  //     const file = path.resolve(__dirname, '../dist', req.params.p);
  //     return new Promise(r => fs.exists(file, r)).then(exists => {
  //       return exists && path.extname(file)
  //         ? h.file(file)
  //         : h.file(path.resolve(__dirname, '../dist/index.html'));
  //     });
  //   }
  // });

  server.route({
    method: 'get',
    path: '/static/{p*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../build/static')
      }
    }
  });

  server.route({
    method: 'get',
    path: '/{p*}',
    handler: {
      file: {
        path: path.resolve(__dirname, '../build/index.html')
      }
    }
  });

  await server.start();
  console.log(`Server started at ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
