//const util = require('util');

//const {spawn} = require("child_process");

//Testing
export class OpenDNS {

  server: string;
  command: string;
  ingress: string[];
  certificate: string;
  user: string;

  constructor(server: string) {
    this.server = server;
    this.command = "";
    this.user = '';
    this.ingress = [];
    this.setCommand(`-o "StrictHostKeyChecking=no" -o "BatchMode yes" -i ${this.certificate} ${this.user}@${this.server} `);
  }

  setServer(s: string) {
    this.server = s;
  }

  getServer(): string {
    return this.server;
  }

  setUser(u: string) {
    this.user = u;
  }

  getUser(): string {
    return this.user;
  }

  setPathKey(c: string) {
    this.certificate = c;
  }

  getPathKey(): string {
    return this.certificate;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any*/
  async execSync(external: any, appendCommand: string) {

    const commandwrapper = `" ${appendCommand} "`
    const remotessh = external("ssh", [this.command + commandwrapper], {shell: true, timeout: 4000});

    let state = -1;

    let result = "";
    let resultErr = "";

    remotessh.on('close', async (code: number) => {
      state = code;
    });

    remotessh.on('exit', async (code: number) => {
      state = code;
      if (code === 1) {
        throw Error(`Error Code: , ${code}`)
      }
    });

    for await (const data of remotessh.stdout) {
      result += data.toString();
    };

    for await (const data of remotessh.stderr) {
      resultErr += data.toString();
    };

    if (resultErr.length === 0) {
      state = 0;
    }

    return {result, resultErr, state}
  }

  /* eslint-disable @typescript-eslint/no-explicit-any*/
  exec(external: any, appendCommand: string) {

    const remotessh = external("ssh", [this.command + appendCommand], {shell: true, timeout: 4000});

    remotessh.on('exit', (code: number) => {
      if (code === 1) {
        throw Error(`Error Code:  ${code}`)
      }
    });

    return {state: 0};

  }

  setCommand(c: string) {
    this.command = c;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any*/
  async changeService(h1: string, h2: string, zona: string, external: any) {
    const appendCommand = `sudo sed -re 's/${h1}/${h2}/g' -i /etc/dnsmasq.d/${zona}`
    const state = await this.execSync(external, appendCommand);
    return state;
  }

  async addService(s: string, z: string, portExternal: number, external: any) {
    try {
      //Add host service
      let texto = "";
      this.getExternals().forEach((item) => {
        const srv = `srv-host=_${s}._tcp.${s},${item},${portExternal},1,1`;
        texto = texto + srv + "\n";
      });
      const txtRecord = `txt-record=_${s}._tcp.${s}` + "\n";
      texto = texto + txtRecord;
      let command = `sudo cat > /etc/dnsmasq.d/${z} <<EOF\n`;
      command = command + texto;
      command = command + "EOF\n"
      const state1 = await this.execSync(external, command);
      if (state1.state === 0) {
        return state1;
      } else {
        throw Error("Error al realizar comunicación remota hacia dns");
      }

    } catch (error) {
      throw Error(`Error ${error}`)
    }
  }

  setExternal(e: string[]) {
    this.ingress = e;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any*/
  async deleteZone(z: string, external: any) {

    const appendCommand = `sudo rm -f /etc/dnsmasq.d/${z}`

    const state1 = await this.execSync(external, appendCommand);

    if (state1.state === 0) {
      return state1;
    } else {
      throw Error("Error to delete zone dns service");
    }
  }

  getExternals(): string[] {
    return this.ingress;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any*/
  async getService(s1: string, external: any) {
    try {

      const appendCommand = `sudo cat /etc/dnsmasq.d/${s1}`

      const state1 = await this.execSync(external, appendCommand);

      if (state1.state === 0) {
        return state1;
      } else {
        throw Error("Error to get zone dns service");
      }
    } catch (error) {
      throw Error(error);
    }
  }

  /* eslint-disable @typescript-eslint/no-explicit-any*/
  async reloadDnsService(external: any) {
    try {

      const state1 = await this.execSync(external, "sudo service dnsmasq restart");

      if (state1.state === 0) {
        //test
        //dns @192.168.246.251 SRV _web2._tcp.web2
        return state1
      } else {
        throw Error("Error al realizar update config dns");
      }

    } catch (error) {
      throw Error(error);
    }
  }

}
