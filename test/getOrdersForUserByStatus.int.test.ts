import retry from 'async-retry';
import { Order } from '../src/models';
import OrdersRepository from '../src/ordersRepository';
import { injectOrder, removeOrders } from './dbUtils';
import { OrderBuilder } from './modelBuilders';

describe('When getting orders for user by status', () => {
  const testOrders: Order[] = [];
  const sut = new OrdersRepository();

  afterAll(async () => {
    await removeOrders(testOrders);
  });

  describe('with initial status', () => {
    it('should return the correct orders, and only those orders', async () => {
      // ARRANGE
      const status = 'new';
      const myNewOrder = new OrderBuilder()
        .withStatus(status)
        .build();
      await injectTestOrder(myNewOrder);
      const myShippedOrder = new OrderBuilder()
        .withStatus('shipped')
        .withUsername(myNewOrder.username)
        .build();
      await injectTestOrder(myShippedOrder);

      await retry(async () => {
        // ACTn
        const newOrders = await sut.getOrdersByUserByStatus({
          username: myNewOrder.username,
          status,
        });

        // ASSERT
        expect(newOrders).toHaveLength(1);
        expect(newOrders?.[0]).toMatchObject({ ...myNewOrder });
      }, { retries: 3 });
    });
  });

  describe('with an updated status', () => {
    let order: Order;

    beforeEach(async () => {
      order = new OrderBuilder().withStatus('new').build();
      await injectTestOrder(order);
    });

    it('should return the correct orders, and only those orders', async () => {
      // ARRANGE
      const myShippedOrder = new OrderBuilder()
        .withStatus('shipped')
        .withUsername(order.username)
        .build();
      await injectTestOrder(myShippedOrder);
      await sut.updateStatus({
        orderId: order.orderId,
        username: order.username,
        status: 'borked',
      });

      // ACT
      const result = await sut.getOrdersByUserByStatus({
        username: order.username, status: 'borked',
      });

      // ASSERT
      expect(result).toHaveLength(1);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ ...order, status: 'borked' }),
        ]),
      );
    });
  });

  const injectTestOrder = async (testOrder: Order): Promise<void> => {
    await injectOrder(testOrder);
    testOrders.push(testOrder);
  };
});
