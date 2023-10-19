import { BaseEntity } from 'typeorm';

export class Warehouse extends BaseEntity {
  id: number;
  name: string;
  address: string;
}
