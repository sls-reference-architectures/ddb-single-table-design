import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { OrderItem } from '../../src/models';

export default class OrderItemBuilder {
  private readonly orderItem: OrderItem;

  constructor() {
    this.orderItem = generateTestOrderItem();
  }

  withOrderId(orderId?: string): OrderItemBuilder {
    if (orderId) {
      this.orderItem.orderId = orderId;
    }

    return this;
  }

  build(): OrderItem {
    return this.orderItem;
  }
}

const generateTestOrderItem = (
  orderId: string = ulid(),
): OrderItem => ({
  orderId,
  itemId: ulid(),
  productName: faker.commerce.productName(),
  price: +faker.commerce.price(),
  quantity: faker.number.int({ min: 1, max: 10 }),
});
