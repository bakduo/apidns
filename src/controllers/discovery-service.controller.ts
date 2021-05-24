// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, HttpErrors, param, post, put, requestBody, response} from '@loopback/rest';
import {EnvConfigResolver} from '../env-config-resolver';
import {Dns, Instance} from '../models';
import {DnsRepository} from '../repositories';
import {OpenDNS} from '../util/operdns';


export interface ReportCustom {
  count: number;
  state: string;
}

export declare const CountSchemaCustom: {
  type: "object";
  title: string;
  'x-typescript-type': string;
  properties: {
    count: {
      type: "number";
    };
    state: {
      type: "string";
    }
  };
};

export class DiscoveryServiceController {

  externalIngress: string[];
  tooldns: OpenDNS;

  constructor(@repository(DnsRepository) protected dnsRepository: DnsRepository,
    @inject('envconfig.app') public config: EnvConfigResolver
  ) {
    //Building access service DNS
    const strServerDns: string = config.getFromEnvVars('SERVERDNS') || "";
    const strIngress: string = config.getFromEnvVars('EXTERNALINGRESS') || "";
    const strUser: string = config.getFromEnvVars('USERDNS') || "";
    const strFileKey: string = config.getFromEnvVars('KEYSSH') || "";
    this.externalIngress = strIngress.split(",");
    this.tooldns = new OpenDNS(strServerDns);
    this.tooldns.setUser(strUser);
    this.tooldns.setPathKey(strFileKey);
    this.tooldns.setExternal(this.externalIngress);
  }

  @get('/dns/{name}')
  @response(200, {
    description: 'Dns model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Dns, {includeRelations: false}),
      },
    },
  })
  async findById(
    @param.path.string('name') name: string,
    @param.filter(Dns, {exclude: 'where'}) filter?: FilterExcludingWhere<Dns>
  ): Promise<Dns> {

    return this.dnsRepository.findById(name, filter);

  }

  @post('/dns', {
    responses: {
      '200': {
        description: 'Dns service instance',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Dns
            }
          }
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Dns, {
            title: 'Service'
          }),
        },
      },
    }) service: Dns,
  ): Promise<Dns> {

    try {
      const dnsnew = await this.dnsRepository.create(service);
      //let resultado = await this.tooldns.addService(service.name, service.name, service.zone || '', service.portingressexternal || 0);
      //console.log(resultado);
      return dnsnew;
    } catch (error) {
      throw new HttpErrors.Conflict(`Error generate new record dns: ${error}`);
    }
  }

  @put('/dns/{name}')
  @response(204, {
    description: 'DNS PUT success',
  })
  async replaceById(
    @param.path.string('name') name: string,
    @requestBody() dns: Dns,
  ): Promise<void> {
    const record = await this.dnsRepository.findById(name);
    if (record) {
      await this.dnsRepository.replaceById(name, dns);
    } else {
      throw new HttpErrors.Conflict(`Error update record dns.`);
    }

  }

  @del('/dns/{name}')
  @response(200, {
    description: 'Host DELETE success',
    content: {'application/json': {schema: CountSchemaCustom}},
  })
  async delete(
    @param.path.string('name') name: string,
    @param.query.object('where', getWhereSchemaFor(Instance)) where?: Where<Instance>,
  ): Promise<ReportCustom> {

    const dnsrecord = await this.dnsRepository.findOne({where: {name: name}});
    if (dnsrecord) {
      console.log(dnsrecord);
      console.log(where);
      const cantDelete = await this.dnsRepository.hosts(name).delete(where)
      if (cantDelete) {
        await this.dnsRepository.delete(dnsrecord);
      }
      return {count: cantDelete.count, state: "OK"};
    } else {
      return {count: 0, state: "Record DNS don't exists"};
    }
  }

  @get('/dns')
  @response(200, {
    description: 'Array of service dns model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Dns, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Dns) filter?: Filter<Dns>,
  ): Promise<Dns[]> {
    return this.dnsRepository.find(filter);
  }

}
