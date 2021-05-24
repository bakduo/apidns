import {createStubInstance, expect, StubbedInstanceWithSinonAccessor} from '@loopback/testlab';
import sinon from 'sinon';
import {DiscoveryServiceController} from '../../../controllers';
import {EnvConfigResolver} from '../../../env-config-resolver';
import {Dns} from '../../../models';
import {DnsRepository} from '../../../repositories';

describe('Dns Services controller unit', () => {

  let repository: StubbedInstanceWithSinonAccessor<DnsRepository>;

  beforeEach(givenStubbedRepository);

  const ContextTest = require('@loopback/context');
  const config = new EnvConfigResolver(ContextTest);

  //test env
  process.env.SERVERDNS = "ipserver";
  process.env.EXTERNALINGRESS = "server1,server2,...servern";
  process.env.USERDNS = 'user';
  process.env.KEYSSH = "id_rsa_dns";

  describe('Methods', () => {

    it('retrieves Dns by name ', async () => {

      //Genero un objeto sample
      const sample = new Dns();
      sample.name = 'webapp1';
      sample.zone = 'zona1';
      sample.portingressexternal = 30090;

      //Genero controller
      const controller = new DiscoveryServiceController(repository, config);

      //Armo una respuesta
      repository.stubs.findById.resolves(sample);

      //Ejecuto la funcion del controller
      const details = await controller.findById(sample.name);

      //Exploro que deberia contener
      expect(details).to.containEql(sample);

      //Ejecuto el assert del stub
      sinon.assert.calledWithMatch(repository.stubs.findById,
        'webapp1',
      );

    });

    it('retrieves all Dns names services', async () => {

      //Genero un objeto sample
      const sample = new Dns();
      sample.name = 'webapp1';
      sample.zone = 'zona1';
      sample.portingressexternal = 30090;
      const vector = [];
      vector.push(sample);

      //Genero controller
      const controller = new DiscoveryServiceController(repository, config);

      //Armo una respuesta
      repository.stubs.find.resolves(vector);

      //Ejecuto la funcion del controller
      const details = await controller.find({where: {name: sample.name}});

      //Exploro que deberia contener
      expect(details).to.containEql(sample);

      //Ejecuto el assert del stub
      sinon.assert.calledWithMatch(repository.stubs.find, {
        where: {name: 'webapp1'},
      });

    });

    it('Create a new Dns services', async () => {

      //Genero un objeto sample
      const sample = new Dns();
      sample.name = 'webapp1';
      sample.zone = 'zona1';
      sample.portingressexternal = 30090;

      //Genero controller
      const controller = new DiscoveryServiceController(repository, config);

      //Armo una respuesta
      repository.stubs.create.resolves(sample);

      //Ejecuto la funcion del controller
      const details = await controller.create(sample);

      //Exploro que deberia contener
      expect(details).to.containEql(sample);

      //Ejecuto el assert del stub
      sinon.assert.calledWithMatch(repository.stubs.create, {
        name: 'webapp1',
        zone: 'zona1',
        portingressexternal: 30090
      });

    });

    it('Delete a service Dns', async () => {

      //Genero un objeto sample
      const sample = new Dns();
      sample.name = 'webapp1';
      sample.zone = 'zona1';
      sample.portingressexternal = 30090;

      //Genero controller
      const controller = new DiscoveryServiceController(repository, config);
      //Armo una respuesta
      await repository.stubs.delete(sample);

      //Ejecuto la funcion del controller
      const details = await controller.delete(sample.name);

      //Exploro que deberia contener
      expect(details).to.containEql({
        count: 0,
        state: "Record DNS don't exists"
      });

      sinon.assert.calledWith(repository.stubs.delete, sample);

    });

    it('update a new Dns services', async () => {

      //Genero un objeto sample
      const sample = new Dns();
      sample.name = 'webapp1';
      sample.zone = 'zona1';
      sample.portingressexternal = 30090;

      const sample1 = new Dns();

      sample1.name = 'webapp1';
      sample1.zone = 'zona2';
      sample1.portingressexternal = 30099;

      //Genero controller
      const controller = new DiscoveryServiceController(repository, config);
      //Armo una respuesta
      repository.stubs.create.resolves(sample);
      repository.stubs.findById.resolves(sample1);
      repository.stubs.replaceById.resolves();
      //Ejecuto la funcion del controller
      await controller.create(sample);
      await controller.replaceById('webapp1', sample1);
      const nuevo = await controller.findById('webapp1');

      //Exploro que deberia contener
      expect(nuevo).to.containEql({
        name: 'webapp1',
        zone: 'zona2',
        portingressexternal: 30099
      });

      //Ejecuto el assert del stub
      sinon.assert.calledWith(repository.stubs.replaceById, 'webapp1', sample1);
    });

  });

  function givenStubbedRepository() {
    repository = createStubInstance(DnsRepository);
  }

  afterEach(() => {
    delete process.env.SERVERDNS;
    delete process.env.EXTERNALINGRESS;
    delete process.env.USERDNS;
    delete process.env.KEYSSH;
  });

});
