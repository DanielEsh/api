class CreateWarehouseProductsDto {
  productId: number;
  quantity: number;
}

export class CreateWarehouseDto {
  name: string;
  address?: string;
  products: CreateWarehouseProductsDto[];
}
