import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbdnsDataSource} from '../datasources';
import {Dns, DnsRelations, Host} from '../models';
import {HostRepository} from './host.repository';

export class DnsRepository extends DefaultCrudRepository<
  Dns,
  typeof Dns.prototype.name,
  DnsRelations
> {

  public readonly hosts: HasManyRepositoryFactory<Host, typeof Dns.prototype.name>;

  constructor(
    @inject('datasources.dbdns') dataSource: DbdnsDataSource,
    @repository.getter('HostRepository') protected hostRepositoryGetter: Getter<HostRepository>,
  ) {
    super(Dns, dataSource);
    this.hosts = this.createHasManyRepositoryFactoryFor('hosts', hostRepositoryGetter,);
    this.registerInclusionResolver('hosts', this.hosts.inclusionResolver);
  }
}
