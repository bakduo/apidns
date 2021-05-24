import {juggler} from '@loopback/repository';

export const testdb: juggler.DataSource = new juggler.DataSource({
  name: 'dbdns',
  connector: 'memory',
  file: process.env.DBTEST
});
