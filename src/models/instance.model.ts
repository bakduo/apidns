import {Entity, model, property} from '@loopback/repository';

@model()
export class Instance extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
  })
  date?: string;

  @property({
    type: 'string',
  })
  hostId?: string;

  constructor(data?: Partial<Instance>) {
    super(data);
  }
}

export interface InstanceRelations {
  // describe navigational properties here
}

export type InstanceWithRelations = Instance & InstanceRelations;
