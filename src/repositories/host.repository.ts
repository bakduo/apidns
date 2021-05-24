import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbdnsDataSource} from '../datasources';
import {Host, HostRelations, Instance} from '../models';
import {InstanceRepository} from './instance.repository';

export class HostRepository extends DefaultCrudRepository<
  Host,
  typeof Host.prototype.id,
  HostRelations
> {

  public readonly instances: HasManyRepositoryFactory<Instance, typeof Host.prototype.id>;

  constructor(
    @inject('datasources.dbdns') dataSource: DbdnsDataSource, @repository.getter('InstanceRepository') protected instanceRepositoryGetter: Getter<InstanceRepository>,
  ) {
    super(Host, dataSource);
    this.instances = this.createHasManyRepositoryFactoryFor('instances', instanceRepositoryGetter,);
    this.registerInclusionResolver('instances', this.instances.inclusionResolver);
  }
}
