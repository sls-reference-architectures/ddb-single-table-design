import { NotFound } from 'http-errors';

import ECommerceModels from './dbModels';

export default class OrdersRepository {
  constructor() {
    this.models = new ECommerceModels();
  }

  async getOrdersByUser(username) {
    const { Items } = await this.models.orders().query(`USER#${username}`);

    return Items;
  }

  async getOrderById(orderId) {
    const queryOptions = {
      index: 'GSI-1',
      beginsWith: 'USER#',
    };
    const { Items } = await this.models.orders().query(`ORDER#${orderId}`, queryOptions);
    if (Items.length === 0) {
      throw new NotFound();
    }

    return Items[0];
  }

  async getOrderItemsByOrderId(orderId) {
    const queryOptions = {
      index: 'GSI-1',
      beginsWith: 'ITEM#',
    };
    const { Items } = await this.models.orderItems().query(`ORDER#${orderId}`, queryOptions);

    return Items;
  }

  async getOrdersByUserByStatus(params) {
    const queryOptions = {
      index: 'GSI-2',
      beginsWith: `${params.status.toUpperCase()}#`,
    };
    const { Items } = await this.models.orderItems().query(`USER#${params.username}`, queryOptions);

    return Items;
  }

  async updateStatus(params) {
    const updateParameters = {};
    if (orderIsNoLongerPlaced(params)) {
      updateParameters.REMOVE = ['gsi3pk'];
    }
    await this.models.orders().update(params, {}, updateParameters);
  }
}

const orderIsNoLongerPlaced = (params) => params.status.toLowerCase() !== 'placed';
