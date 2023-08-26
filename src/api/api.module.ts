import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { AttributesModule } from './modules/attributes/attributes.module';

@Module({
  imports: [CategoriesModule, BrandsModule, AttributesModule],
})
export class ApiModule {}
