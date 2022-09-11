import retry from 'async-retry';

import { Order } from '../src/models';
import OrdersRepository from '../src/ordersRepository';
import { injectOrder, removeOrders } from './dbUtils';
import { OrderBuilder } from './modelBuilders';

describe('When using Orders repository', () => {
  const testOrders: Order[] = [];
  const sut = new OrdersRepository();

  afterAll(async () => {
    await removeOrders(testOrders);
  });

  describe('to get order by its id', () => {
    it('should return existing order', async () => {
      // ARRANGE
      const testOrder = await injectTestOrder();

      // ACT
      const order = await retry<Order>(async () => sut.getOrderById(testOrder.orderId));

      // ASSERT
      expect(order).toMatchObject({ ...testOrder });
    });

    it('should throw Not Found (404) for non-existing order', async () => {
      // ARRANGE
      const nonExistentId = 'I do not exist!';

      // ACT
      const orderAction = () => sut.getOrderById(nonExistentId);

      // ASSERT
      await expect(orderAction()).rejects.toThrow(/not found/i);
    });
  });

  const injectTestOrder = async (): Promise<Order> => {
    const testOrder = new OrderBuilder().build();
    await injectOrder(testOrder);
    testOrders.push(testOrder);

    return testOrder;
  };
});
