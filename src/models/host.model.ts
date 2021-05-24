import {Entity, hasMany, model, property} from '@loopback/repository';
import {Instance} from './instance.model';

@model()
export class Host extends Entity {

  @property({
    type: 'string',
    required: true,
  })
  externalname: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @hasMany(() => Instance)
  instances: Instance[];

  @property({
    type: 'string',
  })
  dnsId?: string;

  constructor(data?: Partial<Host>) {
    super(data);
  }
}

export interface HostRelations {
  // describe navigational properties here
}

export type HostWithRelations = Host & HostRelations;
