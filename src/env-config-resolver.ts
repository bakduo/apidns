import {
  BindingAddress, ConfigurationResolver, Context,
  DefaultConfigurationResolver, inject, ResolutionOptions, ValueOrPromise
} from '@loopback/core';

//source =
//https://github.com/strongloop/loopback-next/blob/master/examples/context/src/custom-configuration-resolver.ts

export class EnvConfigResolver
  extends DefaultConfigurationResolver
  implements ConfigurationResolver {
  constructor(@inject.context() public readonly context: Context) {
    super(context);
  }

  /**
   * Try to find a matching env variable (case insensitive)
   * @param key The binding key
   */
  getFromEnvVars(key: string) {
    let val;
    let found;
    for (const k in process.env) {
      if (k.toUpperCase() === key.toUpperCase()) {
        val = process.env[k];
        found = k;
        break;
      }
    }
    if (val == null) return val;
    console.log(
      'Loading configuration for binding "%s" from env variable "%s"',
      key,
      found,
    );
    try {
      return JSON.parse(val);
    } catch (err) {
      return val;
    }
  }

  getConfigAsValueOrPromise<ConfigValueType>(
    key: BindingAddress<unknown>,
    configPath?: string,
    resolutionOptions?: ResolutionOptions,
  ): ValueOrPromise<ConfigValueType | undefined> {
    const val = this.getFromEnvVars(key.toString());
    if (val != null) return val;
    return super.getConfigAsValueOrPromise(key, configPath, resolutionOptions);
  }
}
