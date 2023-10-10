import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import {
  CrudService,
  ICrudService,
  PaginationsParams,
  type JoinedEntitiesMapper,
} from 'src/shared/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttributeGroup } from './entities/product-attribute-group.entity';
import { CreateAttributesGroupDto } from './dto/create-attributes-group.dto';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';

@Injectable()
export class ProductsService {
  protected readonly crudService: ICrudService<Product>;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {
    this.crudService = new CrudService<Product>(
      this.productRepository,
      'products',
    );
  }

  async create(createProductDto: CreateProductDto) {
    const createdProduct = new Product();
    createdProduct.article = createProductDto.article;
    createdProduct.name = createProductDto.name;
    createdProduct.price = createProductDto.price;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createdProduct.brand = createProductDto.brandId;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    createdProduct.category = createProductDto.categoryId;
    createdProduct.description = createProductDto?.description;

    if (createProductDto.attributesGroups.length) {
      createdProduct.attributeGroup = await Promise.all(
        createProductDto.attributesGroups.map(async (attributesGroup) => {
          return await this.createAttributesGroup({
            name: attributesGroup.name,
            attributes: attributesGroup.attributes,
          });
        }),
      );
    }

    return await this.crudService.create(createdProduct);
  }

  async createAttributesGroup(dto: CreateAttributesGroupDto) {
    const productAttributesGroup = new ProductAttributeGroup();

    productAttributesGroup.name = dto.name;
    productAttributesGroup.attributes = dto.attributes;

    return productAttributesGroup;
  }

  async findAll(options: PaginationsParams) {
    const selectedFields: JoinedEntitiesMapper[] = [
      {
        entity: 'category',
        fields: ['id', 'slug', 'name'],
      },
      {
        entity: 'brand',
        fields: ['id', 'slug', 'name'],
      },
    ];

    return await this.crudService.readAll(options, selectedFields);
  }

  async findOne(id: number) {
    return await this.crudService.readOne(
      {
        name: 'id',
        value: id,
      },
      [
        {
          entity: 'category',
          fields: ['id', 'slug', 'name'],
        },
        {
          entity: 'brand',
          fields: ['id', 'slug', 'name'],
        },
      ],
    );
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // return await this.crudService.update(
    //   { name: 'id', value: id },
    //   updateProductDto,
    // );

    const productToUpdate = await this.crudService.findByParam(
      {
        name: 'id',
        value: id,
      },
      [
        {
          entity: 'category',
          fields: ['id', 'slug', 'name'],
        },
        {
          entity: 'brand',
          fields: ['id', 'slug', 'name'],
        },
      ],
    );

    const updatedCategory = await this.categoryRepository.findOne({
      where: {
        id: updateProductDto.categoryId,
      },
    });

    const updatedBrand = await this.brandRepository.findOne({
      where: {
        id: updateProductDto.brandId,
      },
    });

    productToUpdate.article = updateProductDto.article;
    productToUpdate.name = updateProductDto.name;
    productToUpdate.price = updateProductDto.price;
    productToUpdate.brand = updatedBrand;
    productToUpdate.category = updatedCategory;
    productToUpdate.description = updateProductDto?.description;

    return await this.productRepository.save(productToUpdate);
  }

  async remove(id: number) {
    return await this.crudService.delete({
      name: 'id',
      value: id,
    });
  }
}
