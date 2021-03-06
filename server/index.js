const hapi = require('hapi');
const path = require('path');
const fs = require('fs');
const nconf = require('nconf');

// parse app app config
const config = nconf
  .argv()
  .env('__')
  .file(nconf.get('config') || 'config.json')
  .defaults({
    port: 8080,
    server: 'http://localhost:3000',
    auth: 'Basic YWRtaW46MTIz' // admin:123
  })
  .get();

const server = hapi.server({ port: config.port });

const mapInformerRequest = path => req => {
  const subPath = req.params.p || '';
  return {
    uri: `${config.server}${path}/${subPath}${req.url.search}`,
    headers: {
      Authorization: config.auth
    }
  };
};

const proxyRoute = (path, method) => {
  server.route({
    method: method,
    path: `${path}/{p*}`,
    handler: {
      proxy: {
        xforward: true,
        passThrough: true,
        mapUri: mapInformerRequest(path),
        ttl: 'upstream'
      }
    }
  });
};

const routes = [
  { path: '/api', method: ['get', 'post'] },
  { path: '/v', method: 'get' },
  { path: '/scripts', method: 'get' },
  { path: '/styles', method: 'get' },
  { path: '/jquery', method: 'get' },
  { path: '/assets', method: 'get' },
  { path: '/fonts', method: 'get' }
];

async function init() {
  await server.register({ plugin: require('h2o2') });
  await server.register({ plugin: require('inert') });

  routes.forEach(({ path, method }) => proxyRoute(path, method));

  server.route({
    method: 'get',
    path: '/api',
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
  console.log(`Forwarding requests to ${config.server}`);
}

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
