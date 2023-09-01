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

@Injectable()
export class ProductsService {
  protected readonly crudService: ICrudService<Product>;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
    createdProduct.attributeGroup = null;

    return await this.crudService.create(createdProduct);
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
    return await this.crudService.update(
      { name: 'id', value: id },
      updateProductDto,
    );
  }

  async remove(id: number) {
    return await this.crudService.delete({
      name: 'id',
      value: id,
    });
  }
}
