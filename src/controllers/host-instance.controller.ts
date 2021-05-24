import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Host,
  Instance,
} from '../models';
import {HostRepository} from '../repositories';

export class HostInstanceController {
  constructor(
    @repository(HostRepository) protected hostRepository: HostRepository,
  ) { }

  @get('/hosts/{id}/instances', {
    responses: {
      '200': {
        description: 'Array of Host has many Instance',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Instance)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Instance>,
  ): Promise<Instance[]> {
    return this.hostRepository.instances(id).find(filter);
  }

  @post('/hosts/{id}/instances', {
    responses: {
      '200': {
        description: 'Host model instance',
        content: {'application/json': {schema: getModelSchemaRef(Instance)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Host.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Instance, {
            title: 'NewInstanceInHost',
            exclude: ['id'],
            optional: ['hostId']
          }),
        },
      },
    }) instance: Omit<Instance, 'id'>,
  ): Promise<Instance> {
    return this.hostRepository.instances(id).create(instance);
  }

  @patch('/hosts/{id}/instances', {
    responses: {
      '200': {
        description: 'Host.Instance PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Instance, {partial: true}),
        },
      },
    })
    instance: Partial<Instance>,
    @param.query.object('where', getWhereSchemaFor(Instance)) where?: Where<Instance>,
  ): Promise<Count> {
    return this.hostRepository.instances(id).patch(instance, where);
  }

  @del('/hosts/{id}/instances', {
    responses: {
      '200': {
        description: 'Host.Instance DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Instance)) where?: Where<Instance>,
  ): Promise<Count> {
    return this.hostRepository.instances(id).delete(where);
  }
}
