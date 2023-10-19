import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { AttributesModule } from './modules/attributes/attributes.module';
import { ProductsModule } from './modules/products/products.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { Warehouse } from './modules/warehouse/entities/warehouse.entity';

@Module({
  imports: [
    CategoriesModule,
    BrandsModule,
    AttributesModule,
    ProductsModule,
    UserModule,
    AuthModule,
    RoleModule,
    Warehouse,
  ],
})
export class ApiModule {}
