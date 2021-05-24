import {
  Client, createRestAppClient,
  givenHttpServerConfig
} from '@loopback/testlab';
import {ApidnsApplication} from '../..';
import {testdb} from '../fixtures/datasources/testdb.datasource';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    host: process.env.HOST,
    port: +(process.env.PORT ?? 3001),
  });

  const app = new ApidnsApplication({
    rest: restConfig,
  });

  await app.boot();

  //DB test
  app.dataSource(testdb);

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: ApidnsApplication;
  client: Client;
}
