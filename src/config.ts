import nodeConfig from 'config';

interface Config {
  /** The name of the table */
  tableName: string,
}

const config: Config = {
  tableName: nodeConfig.get<string>('tableName'),
};

export default config;
