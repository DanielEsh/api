import { Injectable } from '@nestjs/common';
import {
  CrudService,
  ICrudService,
  PaginationsParams,
} from '../../../shared/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './order-status.enum';

@Injectable()
export class OrderService {
  protected readonly crudService: ICrudService<Order>;
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {
    this.crudService = new CrudService<Order>(this.orderRepository, 'order');
  }

  async create(createOrderDto: CreateOrderDto) {
    const newOrder = new Order();

    newOrder.name = createOrderDto.name;
    newOrder.email = createOrderDto.email;
    newOrder.phone = createOrderDto.phone;
    newOrder.comment = createOrderDto.comment;
    newOrder.payment_status = createOrderDto.payment_status;
    newOrder.number = await this.generateNumber();

    return await this.orderRepository.save(newOrder);
  }

  async generateNumber() {
    const lastOrder = await this.orderRepository
      .createQueryBuilder()
      .orderBy('number', 'DESC')
      .getOne();

    const initNumber = '000001';

    if (!lastOrder) {
      return initNumber;
    }

    const lastNumber = parseInt(lastOrder.number);
    return (lastNumber + 1).toString().padStart(6, '0');
  }

  async findAll(options: PaginationsParams) {
    return await this.crudService.readAll(options);
  }

  async findOneById(id: number) {
    return await this.crudService.readOne({
      name: 'id',
      value: id,
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.crudService.update(
      { name: 'id', value: id },
      updateOrderDto,
    );
  }
}
