import {Getter} from '@loopback/core';
import {expect} from '@loopback/testlab';
import {DiscoveryServiceController} from '../../../controllers';
import {EnvConfigResolver} from '../../../env-config-resolver';
import {Dns} from '../../../models';
import {DnsRepository} from '../../../repositories';
import {testdb} from '../../fixtures/datasources/testdb.datasource';
import {givenDns, givenEmptyDatabase, hostRepository} from '../../helpers/database.helpers';

describe('Dns Services controller integration', () => {

  const ContextTest = require('@loopback/context');

  //Generate clean DB
  beforeEach(givenEmptyDatabase);

  const config = new EnvConfigResolver(ContextTest);

  //test env
  process.env.SERVERDNS = "ip";
  process.env.EXTERNALINGRESS = "server1,server2,server...";
  process.env.USERDNS = 'user';
  process.env.KEYSSH = "key";

  describe('Integration Dns Services)', () => {

    it('Create a service Dns', async () => {

      //Generate controller test
      const controller = new DiscoveryServiceController(
        new DnsRepository(testdb, Getter.fromValue(hostRepository)), config);

      //new test dns
      const dnsTest = new Dns();
      dnsTest.name = 'webapp1';
      dnsTest.portingressexternal = 30090;
      dnsTest.zone = 'zona1';

      //Find element
      const recordNew = await controller.create(dnsTest);

      //test retrive element
      expect(recordNew).to.containEql({
        name: 'webapp1',
        zone: 'zona1',
        portingressexternal: 30090
      });

    });

    it('retrieves service of the given Dns', async () => {

      //Generate test model partial
      const service = await givenDns({
        name: 'webapp2',
        zone: 'zona1'
      });

      //Generate controller test
      const controller = new DiscoveryServiceController(new
        DnsRepository(testdb, Getter.fromValue(hostRepository)), config);

      //Find element
      const details = await controller.findById('webapp2');

      //test retrive element
      expect(details).to.containEql(service);

    });


    it('Update a service Dns', async () => {

      //Generate test model partial
      await givenDns({
        name: 'webapp1',
        zone: 'zona1'
      });

      //Generate controller test
      const controller = new DiscoveryServiceController(
        new DnsRepository(testdb, Getter.fromValue(hostRepository)), config);

      //new test dns
      const dnsTest = new Dns();
      dnsTest.name = 'webapp1';
      dnsTest.portingressexternal = 30010;
      dnsTest.zone = 'zona3';

      //update element
      await controller.replaceById('webapp1', dnsTest);

      //test find element
      const testRecord = await controller.findById('webapp1');

      //test retrive element
      expect(testRecord).to.containEql({
        name: 'webapp1',
        zone: 'zona3',
        portingressexternal: 30010
      });


    });


    it('Delete service Dns', async () => {

      //Generate test model partial
      await givenDns({
        name: 'webapp2',
        zone: 'zona1'
      });

      //Generate controller test
      const controller = new DiscoveryServiceController(
        new DnsRepository(testdb, Getter.fromValue(hostRepository)), config);

      //Find element
      const details = await controller.delete('webapp2');
      await controller.delete('webapp1');

      //test retrive element
      expect(details).to.containEql({
        count: 0,
        state: "OK"
      });

    });


  });
});

