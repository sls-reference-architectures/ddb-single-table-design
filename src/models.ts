export interface UserProfile {
  username: string,
  fullName: string,
  email: string,
  dateOfBirth: string,
  // Next property must use `any` as ddb-toolbox doesn't yet support the generic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addresses: Record<string, any>,
}

export interface Address {
  street: string,
  postalCode: string,
  state: string,
  countryCode: string,
}

export interface Order {
  username: string,
  orderId: string,
  // Next property must use `any` as ddb-toolbox doesn't yet support the generic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shippingAddress: Record<string, any>,
  status: string,
}

export interface OrderItem {
  itemId?: string,
  orderId: string,
  productName: string,
  price: number,
  quantity: number,
}
