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
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Staff } from '../staff/entity/staff.entity';

@Injectable()
export class OrderService {
  protected readonly crudService: ICrudService<Order>;
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,

    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
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
    return await this.crudService.readOne(
      {
        name: 'id',
        value: id,
      },
      [
        {
          entity: 'warehouse',
          fields: ['id'],
        },
        {
          entity: 'staff',
          fields: ['id'],
        },
      ],
    );
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const orderToUpdate = await this.findOneById(id);

    const updatedWarehouse = await this.warehouseRepository.findOne({
      where: {
        id: updateOrderDto.warehouse,
      },
    });

    const updatedStaff = await this.staffRepository.findOne({
      where: {
        id: updateOrderDto.staff,
      },
    });

    orderToUpdate.name = updateOrderDto.name ?? orderToUpdate.name;
    orderToUpdate.email = updateOrderDto.email ?? orderToUpdate.email;
    orderToUpdate.phone = updateOrderDto.phone ?? orderToUpdate.phone;
    orderToUpdate.comment = updateOrderDto.comment ?? orderToUpdate.comment;
    orderToUpdate.status = updateOrderDto.status ?? orderToUpdate.status;
    orderToUpdate.warehouse = updatedWarehouse ?? orderToUpdate.warehouse;
    orderToUpdate.staff = updatedStaff ?? orderToUpdate.staff;

    return await this.orderRepository.save(orderToUpdate);
  }
}
