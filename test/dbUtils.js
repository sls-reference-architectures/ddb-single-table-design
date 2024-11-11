import ECommerceModels from '../src/dbModels';

const models = new ECommerceModels();

const removeUsers = async (testUsers) => {
  const removePromises = testUsers.map(async (user) => models.users().delete(user));
  await Promise.all(removePromises);
};

const injectUser = async (testUser) => {
  await models.users().put(testUser);
};

const removeOrders = async (testOrders) => {
  const removePromises = testOrders.map(async (order) => models.orders().delete(order));
  await Promise.all(removePromises);
};

const injectOrder = async (testOrder) => {
  await models.orders().put(testOrder);
};

const injectOrderItem = async (testOrderItem) => {
  await models.orderItems().put(testOrderItem);
};

const removeOrderItems = async (testOrderItems) => {
  const removePromises = testOrderItems.map(async (oi) => models.orderItems().delete(oi));
  await Promise.all(removePromises);
};

export { injectOrder, injectOrderItem, injectUser, removeOrderItems, removeOrders, removeUsers };
