import nodeConfig from 'config';

const config = {
  tableName: nodeConfig.get('tableName'),
};

export default config;
