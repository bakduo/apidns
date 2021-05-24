

import {Dns} from '../../models';
import {HostRepository, InstanceRepository} from '../../repositories';
import {DnsRepository} from '../../repositories/dns.repository';
import {testdb} from '../fixtures/datasources/testdb.datasource';

const ContextTest = require('@loopback/context');

export let dnsRepository: DnsRepository;
export let hostRepository: HostRepository;
export let instanceRepository: InstanceRepository;

export async function givenEmptyDatabase() {

  instanceRepository = new InstanceRepository(testdb);
  hostRepository = new HostRepository(testdb, async () => instanceRepository);
  dnsRepository = new DnsRepository(testdb, async () => hostRepository);


  await dnsRepository.deleteAll();
  await hostRepository.deleteAll();
  await instanceRepository.deleteAll();

}

export function givenDnsData(data?: Partial<Dns>) {

  return Object.assign(
    {
      zone: 'zona1',
      portingressexternal: 30090,
      name: 'webapp1'
    },
    data,
  );
}

export async function givenDns(data?: Partial<Dns>) {

  return new DnsRepository(testdb,
    await injectRepoGetter('hostRepository')).create(givenDnsData(data));
}

export function injectRepoGetter(repo: string) {
  return ContextTest.inject.getter(`repositories.${repo}`);
}
