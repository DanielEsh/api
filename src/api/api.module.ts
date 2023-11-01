import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { AttributesModule } from './modules/attributes/attributes.module';
import { ProductsModule } from './modules/products/products.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { OrderModule } from './modules/order/order.module';
import { StaffModule } from './modules/staff/staff.module';

@Module({
  imports: [
    CategoriesModule,
    BrandsModule,
    AttributesModule,
    ProductsModule,
    UserModule,
    AuthModule,
    RoleModule,
    WarehouseModule,
    OrderModule,
    StaffModule,
  ],
})
export class ApiModule {}
