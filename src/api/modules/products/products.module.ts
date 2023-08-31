import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductAttributeGroup } from './entities/product-attribute-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductAttributeGroup])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
