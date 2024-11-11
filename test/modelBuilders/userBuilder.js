import { faker } from '@faker-js/faker';

export default class UserBuilder {
  constructor() {
    this.user = generateTestUser();
  }

  build() {
    return this.user;
  }
}

const generateTestUser = () => ({
  username: faker.internet.userName(),
  dateOfBirth: faker.date.past().toISOString(),
  email: faker.internet.email(),
  fullName: faker.person.fullName(),
  addresses: {
    home: generateAddress(),
  },
});

const generateAddress = () => ({
  street: faker.location.streetAddress(),
  postalCode: faker.location.zipCode(),
  state: faker.location.state(),
  countryCode: faker.location.countryCode(),
});
