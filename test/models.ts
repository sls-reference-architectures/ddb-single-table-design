import { Order } from '../src/models';

export interface OrderDataRaw extends Order, DbMetadata { }

interface DbMetadata {
  gsi2sk: string,
  gsi2pk: string,
  _et: string,
  _ct: string,
  _md: string,
  sk: string,
  pk: string,
  gsi1pk: string,
  gsi1sk: string,
}
