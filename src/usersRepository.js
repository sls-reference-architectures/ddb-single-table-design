import Logger from '@dazn/lambda-powertools-logger';
import { NotFound } from 'http-errors';

import ECommerceModels from './dbModels';

export default class UsersRepository {
  constructor() {
    this.models = new ECommerceModels();
  }

  async getUser(username) {
    const { Item: user } = await this.models.users().get({ username });
    if (!user) {
      Logger.debug('Could not find user', { username });
      throw new NotFound();
    }

    return user;
  }
}
