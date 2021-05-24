import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbdnsDataSource} from '../datasources';
import {Instance, InstanceRelations} from '../models';

export class InstanceRepository extends DefaultCrudRepository<
  Instance,
  typeof Instance.prototype.id,
  InstanceRelations
> {
  constructor(
    @inject('datasources.dbdns') dataSource: DbdnsDataSource,
  ) {
    super(Instance, dataSource);
  }
}
