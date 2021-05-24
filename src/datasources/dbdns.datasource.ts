import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: process.env.MONGO_CONFIG_NAME,
  connector: 'mongodb',
  url: process.env.MONGO_URL,
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_DBPORT,
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASS,
  database: process.env.MONGO_DBNAME,
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbdnsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'dbdns';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.dbdns', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
