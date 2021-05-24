import {Entity, hasMany, model, property} from '@loopback/repository';
import {Host} from './host.model';

@model()
export class Dns extends Entity {
  @property({
    type: 'string',
  })
  iplocal?: string;

  @property({
    type: 'string',
  })
  ipexterna?: string;

  @property({
    type: 'string',
  })
  zone?: string;

  @property({
    type: 'number',
  })
  portingressexternal?: number;

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  name: string;

  @hasMany(() => Host)
  hosts: Host[];

  constructor(data?: Partial<Dns>) {
    super(data);
  }
}

export interface DnsRelations {
  // describe navigational properties here
}

export type DnsWithRelations = Dns & DnsRelations;
