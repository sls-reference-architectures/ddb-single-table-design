import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';

export default class OrderItemBuilder {
  constructor() {
    this.orderItem = generateTestOrderItem();
  }

  withOrderId(orderId) {
    if (orderId) {
      this.orderItem.orderId = orderId;
    }

    return this;
  }

  build() {
    return this.orderItem;
  }
}

const generateTestOrderItem = (orderId = ulid()) => ({
  orderId,
  itemId: ulid(),
  productName: faker.commerce.productName(),
  price: +faker.commerce.price(),
  quantity: faker.number.int({ min: 1, max: 10 }),
});
