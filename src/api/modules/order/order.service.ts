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
import { Product } from '../products/entities/product.entity';
import { OrderProducts } from './entity/order-products.entity';

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

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(OrderProducts)
    private orderProductsRepository: Repository<OrderProducts>,
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

    const savedOrder = await this.orderRepository.save(newOrder);

    if (createOrderDto.products.length) {
      for (const productData of createOrderDto.products) {
        const product = await this.productRepository.findOne({
          where: {
            id: productData.id,
          },
        });

        const newOrderProduct = new OrderProducts();

        newOrderProduct.product = product;
        newOrderProduct.order = newOrder;
        newOrderProduct.count = productData.count;

        await this.orderProductsRepository.save(newOrderProduct);
      }
    }

    return savedOrder;
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
    const order = await this.crudService.readOne(
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

    order.products = await this.orderProductsRepository.find({
      where: {
        order: {
          id: order.id,
        },
      },
      relations: ['product'],
    });

    return order;
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
