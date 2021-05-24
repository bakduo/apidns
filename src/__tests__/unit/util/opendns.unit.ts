import {expect} from '@loopback/testlab';
import {OpenDNS} from '../../../util/operdns';

const {spawn} = require("child_process");

describe('OpenDNS (unit)', () => {

  const openTmp = new OpenDNS("0.0.0.0");

  const server: string = process.env.SERVERDNS ?? "";
  const external: string[] = (process.env.EXTERNALINGRESS)?.split(',') ?? [];
  const userserver: string = process.env.USERDNS ?? "";
  const sshkey: string = process.env.KEYSSH ?? "";

  it('Update service dnsmasq', async () => {

    openTmp.setPathKey(sshkey);
    openTmp.setUser(userserver);
    openTmp.setServer(server);
    openTmp.setExternal(external);
    openTmp.setCommand(`-o "StrictHostKeyChecking=no" -i ${openTmp.getPathKey()} ${openTmp.getUser()}@${openTmp.getServer()} `);

    const estado = await openTmp.changeService("webapp1", "webapp2", "zona2", spawn);

    expect(estado.state).equal(-1);

  });

  it('Create service dnsmasq', async () => {

    openTmp.setPathKey(sshkey);
    openTmp.setUser(userserver);
    openTmp.setServer(server);
    openTmp.setExternal(external);
    openTmp.setCommand(`-o "StrictHostKeyChecking=no" -i ${openTmp.getPathKey()} ${openTmp.getUser()}@${openTmp.getServer()} `);

    const estado = await openTmp.addService('webservice', 'zona2', 8080, spawn);

    expect(estado).containEql({
      result: '',
      resultErr: '',
      state: 0
    })

  });

  it('Get service dnsmasq', async () => {

    openTmp.setPathKey(sshkey);
    openTmp.setUser(userserver);
    openTmp.setServer(server);
    openTmp.setExternal(external);
    openTmp.setCommand(`-o "StrictHostKeyChecking=no" -i ${openTmp.getPathKey()} ${openTmp.getUser()}@${openTmp.getServer()} `);

    const estado = await openTmp.getService('zona1', spawn);

    expect(estado.state).equal(0);
    expect(estado.result).containEql('srv-host=_web2._tcp.web2,kube-00.rpc.com,30090,1,1\nsrv-host=_web2._tcp.web2,kube-01.rpc.com,30090,1,1\nsrv-host=_web2._tcp.web2,kube-02.rpc.com,30090,1,1\ntxt-record=_web2._tcp.web2\n');

  });


  it('Delete service dnsmasq', async () => {

    openTmp.setPathKey(sshkey);
    openTmp.setUser(userserver);
    openTmp.setServer(server);
    openTmp.setExternal(external);
    openTmp.setCommand(`-o "StrictHostKeyChecking=no" -i ${openTmp.getPathKey()} ${openTmp.getUser()}@${openTmp.getServer()} `);

    const estado = await openTmp.deleteZone('zona2', spawn);

    expect(estado).containEql({
      result: '',
      resultErr: '',
      state: 0
    })

  });

  it('Reload service dnsmasq', async () => {

    openTmp.setPathKey(sshkey);
    openTmp.setUser(userserver);
    openTmp.setServer(server);
    openTmp.setExternal(external);
    openTmp.setCommand(`-o "StrictHostKeyChecking=no" -i ${openTmp.getPathKey()} ${openTmp.getUser()}@${openTmp.getServer()} `);

    const estado = await openTmp.reloadDnsService(spawn);

    expect(estado).containEql({
      result: '',
      resultErr: '',
      state: 0
    })

  });

});
