
const serverlessConfiguration: any = {
  service: 'serverless-esbuild',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: { 
    hello: {
    handler: 'src/index.handler',
    events: [{
      http: {
          method: 'get',
          path: 'hello'
      }
    }]
  } 
},
  custom: {
    'serverless-offline': {
      reloadHandler: true,
      noPrependStageInUrl: true,
      prefix: 'api/v1'
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
}

module.exports = serverlessConfiguration;
