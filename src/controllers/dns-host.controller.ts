import {
  Count,
  CountSchema, Filter, repository, Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Dns,
  Host
} from '../models';
import {DnsRepository} from '../repositories';


export class DnsHostController {

  constructor(
    @repository(DnsRepository) protected dnsRepository: DnsRepository,

  ) {

  }

  @get('/dns/{id}/hosts', {
    responses: {
      '200': {
        description: 'Array of Dns has many Host',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Host)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Host>,
  ): Promise<Host[]> {
    return this.dnsRepository.hosts(id).find(filter);
  }

  @post('/dns/{id}/hosts', {
    responses: {
      '200': {
        description: 'Dns model instance',
        content: {'application/json': {schema: getModelSchemaRef(Host)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Dns.prototype.name,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Host, {
            title: 'NewHostInDns',
            exclude: ['id'],
            optional: ['dnsId']
          }),
        },
      },
    }) host: Omit<Host, 'id'>,
  ): Promise<Host> {

    return this.dnsRepository.hosts(id).create(host);
  }

  @patch('/dns/{id}/hosts', {
    responses: {
      '200': {
        description: 'Dns.Host PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Host, {partial: true}),
        },
      },
    })
    host: Partial<Host>,
    @param.query.object('where', getWhereSchemaFor(Host)) where?: Where<Host>,
  ): Promise<Count> {
    return this.dnsRepository.hosts(id).patch(host, where);
  }

  @del('/dns/{id}/hosts', {
    responses: {
      '200': {
        description: 'Dns.Host DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Host)) where?: Where<Host>,
  ): Promise<Count> {
    return this.dnsRepository.hosts(id).delete(where);
  }
}
