import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';

export default class OrderBuilder {
  constructor() {
    this.order = generateTestOrder();
  }

  withUsername(username) {
    if (username) {
      this.order.username = username;
    }

    return this;
  }

  withStatus(status) {
    if (status) {
      this.order.status = status;
    }

    return this;
  }

  build() {
    return this.order;
  }
}

const generateTestOrder = (username = `${faker.internet.username()}_${ulid()}`) => ({
  username,
  orderId: ulid(),
  shippingAddress: generateAddress(),
  status: faker.helpers.arrayElement(['new', 'shipped', 'canceled']),
});

const generateAddress = () => ({
  street: faker.location.streetAddress(),
  postalCode: faker.location.zipCode(),
  state: faker.location.state(),
  countryCode: faker.location.countryCode(),
});
