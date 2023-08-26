import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';

@Module({
  imports: [CategoriesModule, BrandsModule],
})
export class ApiModule {}
