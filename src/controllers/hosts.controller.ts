import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Host} from '../models';
import {HostRepository} from '../repositories';

export class HostsController {
  constructor(
    @repository(HostRepository)
    public hostRepository : HostRepository,
  ) {}

  @post('/hosts')
  @response(200, {
    description: 'Host model instance',
    content: {'application/json': {schema: getModelSchemaRef(Host)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Host, {
            title: 'NewHost',
            exclude: ['id'],
          }),
        },
      },
    })
    host: Omit<Host, 'id'>,
  ): Promise<Host> {
    return this.hostRepository.create(host);
  }

  @get('/hosts/count')
  @response(200, {
    description: 'Host model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Host) where?: Where<Host>,
  ): Promise<Count> {
    return this.hostRepository.count(where);
  }

  @get('/hosts')
  @response(200, {
    description: 'Array of Host model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Host, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Host) filter?: Filter<Host>,
  ): Promise<Host[]> {
    return this.hostRepository.find(filter);
  }

  @patch('/hosts')
  @response(200, {
    description: 'Host PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Host, {partial: true}),
        },
      },
    })
    host: Host,
    @param.where(Host) where?: Where<Host>,
  ): Promise<Count> {
    return this.hostRepository.updateAll(host, where);
  }

  @get('/hosts/{id}')
  @response(200, {
    description: 'Host model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Host, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Host, {exclude: 'where'}) filter?: FilterExcludingWhere<Host>
  ): Promise<Host> {
    return this.hostRepository.findById(id, filter);
  }

  @patch('/hosts/{id}')
  @response(204, {
    description: 'Host PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Host, {partial: true}),
        },
      },
    })
    host: Host,
  ): Promise<void> {
    await this.hostRepository.updateById(id, host);
  }

  @put('/hosts/{id}')
  @response(204, {
    description: 'Host PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() host: Host,
  ): Promise<void> {
    await this.hostRepository.replaceById(id, host);
  }

  @del('/hosts/{id}')
  @response(204, {
    description: 'Host DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.hostRepository.deleteById(id);
  }
}
