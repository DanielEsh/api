import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductAttributeGroup } from './entities/product-attribute-group.entity';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { WarehouseProducts } from '../warehouse/entities/warehouse-products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductAttributeGroup,
      Category,
      Brand,
      WarehouseProducts,
    ]),
  ],
  controllers: [ProductsController],
  exports: [ProductsService],
  providers: [ProductsService],
})
export class ProductsModule {}
