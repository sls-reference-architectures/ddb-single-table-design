import retry from 'async-retry';

import { Order, OrderItem } from '../src/models';
import OrdersRepository from '../src/ordersRepository';
import {
  injectOrder,
  injectOrderItem,
  removeOrderItems,
  removeOrders,
} from './dbUtils';
import { OrderBuilder } from './modelBuilders';
import OrderItemBuilder from './modelBuilders/orderItemBuilder';

describe('When using OrderItems repository to get items for an order', () => {
  const testOrders: Order[] = [];
  const testOrderItems: OrderItem[] = [];
  const sut = new OrdersRepository();

  afterAll(async () => {
    await removeOrders(testOrders);
    await removeOrderItems(testOrderItems);
  });

  describe('with one item', () => {
    it('should retrieve the item', async () => {
      // ARRANGE
      const testOrder = await injectTestOrder();
      const testItem = await injectTestOrderItem(testOrder.orderId);

      // ACT
      const [result] = await getOrderItemsWithRetry(testOrder.orderId);

      // ASSERT
      expect(result).toMatchObject({ ...testItem });
    });
  });

  describe('with multiple items', () => {
    it('should retrieve all items (and only those items)', async () => {
      // ARRANGE
      const testOrder = await injectTestOrder();
      const testItemOne = await injectTestOrderItem(testOrder.orderId);
      const testItemTwo = await injectTestOrderItem(testOrder.orderId);
      await injectTestOrderItem('some-other-orderId');

      // ACT
      const result = await getOrderItemsWithRetry(testOrder.orderId, 2);

      // ASSERT
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ ...testItemOne }),
          expect.objectContaining({ ...testItemTwo }),
        ]),
      );
    });
  });

  describe('with no items', () => {
    it('should return an empty array', async () => {
      // ARRANGE
      const testOrder = await injectTestOrder();

      // ACT
      const result = await getOrderItemsWithRetry(testOrder.orderId, 0);

      // ASSERT
      expect(result).toHaveLength(0);
    });
  });

  const injectTestOrder = async (username?: string): Promise<Order> => {
    const testOrder = new OrderBuilder().withUsername(username).build();
    await injectOrder(testOrder);
    testOrders.push(testOrder);

    return testOrder;
  };

  const injectTestOrderItem = async (orderId: string): Promise<OrderItem> => {
    const testOrderItem = new OrderItemBuilder().withOrderId(orderId).build();
    await injectOrderItem(testOrderItem);
    testOrderItems.push(testOrderItem);

    return testOrderItem;
  };

  const getOrderItemsWithRetry = async (
    orderId: string,
    expectedNumber = 1,
  ): Promise<OrderItem[]> => {
    const result = await retry<OrderItem[]>(async () => {
      const orderItems = await sut.getOrderItemsByOrderId(orderId);
      if (orderItems.length !== expectedNumber) {
        throw Error();
      }

      return orderItems;
    });

    return result;
  };
});
