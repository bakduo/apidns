import {Client, expect} from '@loopback/testlab';
import {ApidnsApplication} from '../..';
import {givenDns, givenEmptyDatabase} from '../helpers/database.helpers';
import {setupApplication} from './test-helper';

describe('Dns Service Controller (acceptance)', () => {

  let app: ApidnsApplication;

  let client: Client;

  before(givenEmptyDatabase);

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('Create service ', async () => {

    const response = await client.post('/dns').send({
      zone: 'zona1',
      portingressexternal: 56553,
      name: 'webapp5',
    }).expect(200);

    // assert
    expect(response.body).to.containEql({
      zone: 'zona1',
      portingressexternal: 56553,
      name: 'webapp5',
    });

  });

  it('retrieves service by name', async () => {

    // arrange
    await givenDns({
      zone: 'zona1',
      portingressexternal: 30090,
      name: 'webapp4',
    });

    // act
    const response = await client.get('/dns/webapp4').expect(200);

    // assert
    expect(response.body).to.containEql({
      zone: 'zona1',
      portingressexternal: 30090,
      name: 'webapp4',
    });

  });

  it('Delete service by name', async () => {

    // arrange
    await givenDns({
      zone: 'zona1',
      portingressexternal: 30090,
      name: 'webapp6',
    });

    // act
    const response = await client.del('/dns/webapp6').expect(200);

    // assert
    expect(response.body).to.containEql({count: 0, state: "OK"});

  });

  it('Update service by name', async () => {

    // arrange
    await givenDns({
      zone: 'zona1',
      portingressexternal: 30090,
      name: 'webapp7',
    });

    // act
    const response = await client.put('/dns/webapp7').send({
      zone: 'zona4',
      portingressexternal: 41090,
      name: 'webapp7',
    })

    // assert
    expect(response.body).to.containEql(Promise.resolve());

  });



});
