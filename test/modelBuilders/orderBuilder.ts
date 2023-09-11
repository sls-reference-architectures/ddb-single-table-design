import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { Address, Order } from '../../src/models';

export default class OrderBuilder {
  private readonly order: Order;

  constructor() {
    this.order = generateTestOrder();
  }

  withUsername(username?: string): OrderBuilder {
    if (username) {
      this.order.username = username;
    }

    return this;
  }

  withStatus(status?: string): OrderBuilder {
    if (status) {
      this.order.status = status;
    }

    return this;
  }

  build(): Order {
    return this.order;
  }
}

const generateTestOrder = (
  username = `${faker.internet.userName()}_${ulid()}`,
): Order => ({
  username,
  orderId: ulid(),
  shippingAddress: generateAddress(),
  status: faker.helpers.arrayElement(['new', 'shipped', 'canceled']),
});

const generateAddress = (): Address => ({
  street: faker.location.streetAddress(),
  postalCode: faker.location.zipCode(),
  state: faker.location.state(),
  countryCode: faker.location.countryCode(),
});
