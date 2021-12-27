import retry from 'async-retry';
import ECommerceModels from '../src/dbModels';

import { Order } from '../src/models';
import OrdersRepository from '../src/ordersRepository';
import { injectOrder, removeOrders } from './dbUtils';
import { OrderBuilder } from './modelBuilders';
import { OrderDataRaw } from './models';

describe('When updating order status for a user', () => {
  const testOrders: Order[] = [];
  const sut = new OrdersRepository();

  afterAll(async () => {
    await removeOrders(testOrders);
  });

  it('should change the status', async () => {
    // ARRANGE
    const originalOrder = new OrderBuilder().withStatus('new').build();
    await injectTestOrder(originalOrder);
    const shippedOrder = { ...originalOrder, status: 'shipped' };

    // ACT
    await sut.updateStatus(shippedOrder);

    // ASSERT
    const order = await fetchOrderWithRetry(originalOrder.orderId, 'shipped');
    expect(order).toMatchObject({ ...shippedOrder });
  });

  it('should change the GSI2-SK', async () => {
    // ARRANGE
    const originalOrder = new OrderBuilder().withStatus('new').build();
    await injectTestOrder(originalOrder);
    const shippedOrder = { ...originalOrder, status: 'shipped' };

    // ACT
    await sut.updateStatus(shippedOrder);

    // ASSERT
    const { gsi2sk } = await fetchOrderWithRetry(originalOrder.orderId, 'shipped');
    expect(gsi2sk).toStartWith('SHIPPED#');
  });

  describe('to placed', () => {
    it('should create the GSI3-PK', async () => {
      // ARRANGE
      const originalOrder = new OrderBuilder().withStatus('new').build();
      await injectTestOrder(originalOrder);
      const placedOrder = { ...originalOrder, status: 'placed' };

      // ACT
      await sut.updateStatus(placedOrder);

      // ASSERT
      const { gsi3pk } = await fetchOrderWithRetry(originalOrder.orderId, 'placed');
      expect(gsi3pk).toBeString();
    });
  });

  describe('from placed', () => {
    it('should remove the GSI3-PK', async () => {
      // ARRANGE
      const originalOrder = new OrderBuilder().withStatus('placed').build();
      await injectTestOrder(originalOrder);
      const placedOrder = { ...originalOrder, status: 'shipped' };

      // ACT
      await sut.updateStatus(placedOrder);

      // ASSERT
      const { gsi3pk } = await fetchOrderWithRetry(originalOrder.orderId, 'shipped');
      expect(gsi3pk).toBeUndefined();
    });
  });

  const injectTestOrder = async (testOrder: Order): Promise<void> => {
    await injectOrder(testOrder);
    testOrders.push(testOrder);
  };
});

const fetchOrderWithRetry = async (orderId: string, status: string): Promise<OrderDataRaw> => {
  const models = new ECommerceModels();
  const result = await retry<OrderDataRaw>(async () => {
    const queryOptions = {
      index: 'GSI-1',
      beginsWith: 'USER#',
      parse: false,
    };
    const { Items: [order] } = await models.orders.query(`ORDER#${orderId}`, queryOptions);
    if (order && order.status !== status) {
      throw Error();
    }

    return order;
  });

  return result;
};
