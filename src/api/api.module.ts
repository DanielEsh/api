import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { AttributesModule } from './modules/attributes/attributes.module';
import { GoodsModule } from './modules/goods/goods.module';

@Module({
  imports: [CategoriesModule, BrandsModule, AttributesModule, GoodsModule],
})
export class ApiModule {}
