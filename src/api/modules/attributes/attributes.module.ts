import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { Attribute } from './entities/attribute.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributeGroup } from '../products/entities/product-attribute-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute, ProductAttributeGroup])],
  controllers: [AttributesController],
  providers: [AttributesService],
})
export class AttributesModule {}
