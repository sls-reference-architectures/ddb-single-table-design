import retry from 'async-retry';

import { removeUsers, injectUser } from './dbUtils';
import { UserProfile } from '../src/models';
import UsersRepository from '../src/usersRepository';
import { UserBuilder } from './modelBuilders';

describe('When using Users Repository', () => {
  const testUsers: UserProfile[] = [];
  const sut = new UsersRepository();

  afterAll(async () => {
    await removeUsers(testUsers);
  });

  describe('to retrieve a User', () => {
    it('should fetch by username', async () => {
      // ARRANGE
      const userProfile = new UserBuilder().build();
      await injectUser(userProfile);
      testUsers.push(userProfile);

      // ACT
      const result = await retry<UserProfile>(async () => sut.getUser(userProfile.username));

      // ASSERT
      expect(result).toMatchObject({ ...userProfile });
    });

    describe('and user is not in DB', () => {
      it('should throw NotFound (404)', async () => {
        // ARRANGE/ACT
        const getUserAction = async () => sut.getUser('I do not exist');

        // ASSERT
        await expect(getUserAction()).rejects.toThrow(/Not Found/);
      });
    });
  });
});
