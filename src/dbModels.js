import { Table, Entity } from 'dynamodb-toolbox';
import { ulid } from 'ulid';

import config from './config';
import getDocumentClient from './documentClient';

const documentClient = getDocumentClient();

class ECommerceModels {
  constructor() {
    this.tableReference = generateECommerceTable();
    this.usersEntity = generateUserModel(this.tableReference);
    this.ordersEntity = generateOrderModel(this.tableReference);
    this.orderItemsEntity = generateOrderItemModel(this.tableReference);
  }

  orders() {
    return this.ordersEntity;
  }

  users() {
    return this.usersEntity;
  }

  orderItems() {
    return this.orderItemsEntity;
  }

  table() {
    return this.tableReference;
  }
}

const generateECommerceTable = () => {
  const ECommerceTable = new Table({
    name: config.tableName,
    partitionKey: 'pk',
    sortKey: 'sk',
    indexes: {
      'GSI-1': { partitionKey: 'gsi1pk', sortKey: 'gsi1sk' },
      'GSI-2': { partitionKey: 'gsi2pk', sortKey: 'gsi2sk' },
    },
    DocumentClient: documentClient,
  });

  return ECommerceTable;
};

const generateUserModel = (table) => {
  const setUserPk = (data) => `USER#${data.username}`;
  const setUserSk = (data) => `#PROFILE#${data.username}`;

  return new Entity({
    name: 'UserProfile',
    timestamps: true,
    attributes: {
      pk: { partitionKey: true, hidden: true, default: setUserPk },
      sk: { sortKey: true, hidden: true, default: setUserSk },
      username: { required: 'always' },
      dateOfBirth: 'string',
      email: 'string',
      fullName: 'string',
      addresses: 'map',
    },
    table,
  });
};

const generateOrderModel = (table) => {
  const setOrderPk = (data) => `USER#${data.username}`;
  const setOrderSk = (data) => `ORDER#${data.orderId}`;
  const setOrderGSI1PK = setOrderSk;
  const setOrderGSI1SK = setOrderPk;
  const setOrderGSI2PK = setOrderPk;
  const setOrderGSI2SK = (data) => `${data.status.toUpperCase()}#${new Date().toISOString()}`;
  const setOrderGSI3PK = (data) => {
    if (data.status.toLowerCase() === 'placed') {
      return ulid();
    }

    return undefined;
  };

  return new Entity({
    name: 'Order',
    timestamps: true,
    attributes: {
      pk: { partitionKey: true, hidden: true, default: setOrderPk },
      sk: { sortKey: true, hidden: true, default: setOrderSk },
      gsi1pk: { hidden: true, default: setOrderGSI1PK },
      gsi1sk: { hidden: true, default: setOrderGSI1SK },
      gsi2pk: { hidden: true, default: setOrderGSI2PK },
      gsi2sk: { hidden: true, onUpdate: true, default: setOrderGSI2SK },
      gsi3pk: { hidden: true, onUpdate: true, default: setOrderGSI3PK },
      username: { required: 'always' },
      status: { required: 'always' },
      orderId: 'string',
      shippingAddress: 'map',
    },
    table,
  });
};

const generateOrderItemModel = (table) => {
  const setOrderItemPk = (data) => `ITEM#${data.itemId}`;
  const setOrderItemSk = (data) => `ORDER#${data.orderId}`;
  const setOrderItemGSI1PK = setOrderItemSk;
  const setOrderItemGSI1SK = setOrderItemPk;

  return new Entity({
    name: 'OrderItem',
    timestamps: true,
    attributes: {
      pk: { partitionKey: true, hidden: true, default: setOrderItemPk },
      sk: { sortKey: true, hidden: true, default: setOrderItemSk },
      gsi1pk: { hidden: true, default: setOrderItemGSI1PK },
      gsi1sk: { hidden: true, default: setOrderItemGSI1SK },
      itemId: { required: 'always' },
      orderId: { required: 'always' },
      productName: 'string',
      price: 'number',
      quantity: 'number',
    },
    table,
  });
};

export default ECommerceModels;
