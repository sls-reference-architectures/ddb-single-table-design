import { UserProfile, Order, OrderItem } from '../src/models';
import ECommerceModels from '../src/dbModels';

const models = new ECommerceModels();

const removeUsers = async (testUsers: UserProfile[]): Promise<void> => {
  const removePromises = testUsers.map(async (user) => models.users.delete(user));
  await Promise.all(removePromises);
};

const injectUser = async (testUser: UserProfile): Promise<void> => {
  await models.users.put(testUser);
};

const removeOrders = async (testOrders: Order[]): Promise<void> => {
  const removePromises = testOrders.map(async (order) => models.orders.delete(order));
  await Promise.all(removePromises);
};

const injectOrder = async (testOrder: Order): Promise<void> => {
  await models.orders.put(testOrder);
};

const injectOrderItem = async (testOrderItem: OrderItem): Promise<void> => {
  await models.orderItems.put(testOrderItem);
};

const removeOrderItems = async (testOrderItems: OrderItem[]): Promise<void> => {
  const removePromises = testOrderItems.map(async (oi) => models.orderItems.delete(oi));
  await Promise.all(removePromises);
};

export {
  injectOrder,
  injectOrderItem,
  injectUser,
  removeOrderItems,
  removeOrders,
  removeUsers,
};
