import { faker } from '@faker-js/faker';
import { Address, UserProfile } from '../../src/models';

export default class UserBuilder {
  private readonly user: UserProfile;

  constructor() {
    this.user = generateTestUser();
  }

  build(): UserProfile {
    return this.user;
  }
}

const generateTestUser = (): UserProfile => ({
  username: faker.internet.userName(),
  dateOfBirth: faker.date.past().toISOString(),
  email: faker.internet.email(),
  fullName: faker.person.fullName(),
  addresses: {
    home: generateAddress(),
  },
});

const generateAddress = (): Address => ({
  street: faker.address.streetAddress(),
  postalCode: faker.address.zipCode(),
  state: faker.address.state(),
  countryCode: faker.address.countryCode(),
});
