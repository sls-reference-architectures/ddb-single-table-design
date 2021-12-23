import Logger from '@dazn/lambda-powertools-logger';
import { NotFound } from 'http-errors';

import ECommerceModels from './dbModels';
import { UserProfile } from './models';

export default class UsersRepository {
  private models: ECommerceModels;

  constructor() {
    this.models = new ECommerceModels();
  }

  async getUser(username: string): Promise<UserProfile> {
    const { Item: user } = await this.models.users.get({ username });
    if (!user) {
      Logger.debug('Could not find user', { username });
      throw new NotFound();
    }

    return user;
  }
}
