import { Logger } from '@aws-lambda-powertools/logger';
import { NotFound } from 'http-errors';

import ECommerceModels from './dbModels';

const logger = new Logger({ serviceName: 'ddb-single-table-design' });

export default class UsersRepository {
  constructor() {
    this.models = new ECommerceModels();
  }

  async getUser(username) {
    const { Item: user } = await this.models.users().get({ username });
    if (!user) {
      logger.debug('Could not find user', { username });
      throw new NotFound();
    }

    return user;
  }
}
