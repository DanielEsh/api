import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { CrudService, ICrudService, PaginationsParams } from 'src/shared/crud';
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

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(options: PaginationsParams) {
    return await this.crudService.readAll(options);
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
