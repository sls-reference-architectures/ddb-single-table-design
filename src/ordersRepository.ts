import { NotFound } from 'http-errors';

import ECommerceModels from './dbModels';
import { Order, OrderItem } from './models';

export default class OrdersRepository {
  private models: ECommerceModels;

  constructor() {
    this.models = new ECommerceModels();
  }

  async getOrdersByUser(username: string): Promise<Order[]> {
    const { Items } = await this.models.orders.query(`USER#${username}`);

    return Items as Order[];
  }

  async getOrderById(orderId: string): Promise<Order> {
    const queryOptions = {
      index: 'GSI-1',
      beginsWith: 'USER#',
    };
    const { Items } = await this.models.orders.query(`ORDER#${orderId}`, queryOptions);
    if (Items.length === 0) {
      throw new NotFound();
    }

    return Items[0];
  }

  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const queryOptions = {
      index: 'GSI-1',
      beginsWith: 'ITEM#',
    };
    const { Items } = await this.models.orderItems.query(`ORDER#${orderId}`, queryOptions);

    return Items;
  }

  async getOrdersByUserByStatus(params: OrdersByStatusParams): Promise<Order[]> {
    const queryOptions = {
      index: 'GSI-2',
      beginsWith: `${params.status.toUpperCase()}#`,
    };
    const { Items } = await this.models.orderItems.query(`USER#${params.username}`, queryOptions);

    return Items;
  }

  async updateStatus(params: UpdateStatusParams): Promise<void> {
    await this.models.orders.update(params);
  }
}

interface OrdersByStatusParams {
  status: string,
  username: string,
}

interface UpdateStatusParams {
  orderId: string,
  status: string,
  username: string,
}
