import retry from 'async-retry';
import { faker } from '@faker-js/faker';

import OrdersRepository from '../src/ordersRepository';
import { injectOrder, removeOrders } from './dbUtils';
import { OrderBuilder } from './modelBuilders';

describe('When using Orders repository', () => {
  const testOrders = [];
  const sut = new OrdersRepository();

  afterAll(async () => {
    await removeOrders(testOrders);
  });

  describe('to get orders for a user', () => {
    it('should retrieve his only order', async () => {
      // ARRANGE
      const testOrder = await injectTestOrder();

      // ACT
      const result = await getOrdersByUserWithRetry(testOrder.username);

      // ASSERT
      expect(result[0]).toMatchObject({ ...testOrder });
    });

    it('should retrieve all his orders', async () => {
      // ARRANGE
      const username = faker.internet.username();
      const testOrder1 = await injectTestOrder(username);
      const testOrder2 = await injectTestOrder(username);

      // ACT
      const result = await getOrdersByUserWithRetry(username, 2);

      // ASSERT
      expect(result[0]).toMatchObject({ ...testOrder1 });
      expect(result[1]).toMatchObject({ ...testOrder2 });
    });

    it("should not retrieve another user's orders", async () => {
      // ARRANGE
      const myOrder = await injectTestOrder();
      await injectTestOrder('someone else owns this order');

      // ACT
      const result = await getOrdersByUserWithRetry(myOrder.username);

      // ASSERT
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ ...myOrder });
    });
  });

  const injectTestOrder = async (username) => {
    const testOrder = new OrderBuilder().withUsername(username).build();
    await injectOrder(testOrder);
    testOrders.push(testOrder);

    return testOrder;
  };

  const getOrdersByUserWithRetry = async (username, expectedCount = 1) => {
    const result = await retry(async () => {
      const orders = await sut.getOrdersByUser(username);
      if (orders.length !== expectedCount) {
        throw Error();
      }

      return orders;
    });

    return result;
  };
});
