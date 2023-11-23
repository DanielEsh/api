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
import { OrderDto } from './dto/order.dto';

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

    newOrder.firstName = createOrderDto.user_details.firstName;
    newOrder.lastName = createOrderDto.user_details.lastName;
    newOrder.middleName = createOrderDto.user_details.middleName;
    newOrder.email = createOrderDto.user_details.email;
    newOrder.phone = 79991002030;
    newOrder.comment = createOrderDto.user_details.comment;
    newOrder.total_price = 0;
    // newOrder.payment_status = createOrderDto.payment_status;
    newOrder.number = await this.generateNumber();

    const savedOrder = await this.orderRepository.save(newOrder);

    if (createOrderDto?.products?.length) {
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

  async findOne(id: number) {
    const order = await this.crudService.readOne(
      {
        name: 'id',
        value: id,
      },
      [
        // {
        //   entity: 'warehouse',
        //   fields: ['id'],
        // },
        // {
        //   entity: 'staff',
        //   fields: ['id'],
        // },
      ],
    );

    // order.products = await this.orderProductsRepository.find({
    //   where: {
    //     order: {
    //       id: order.id,
    //     },
    //   },
    //   relations: ['product'],
    // });

    return order;
  }

  async findOneById(id: number): Promise<OrderDto> {
    const order = await this.findOne(id);

    return {
      id: order.id,
      number: order.number,
      payment_status: order.payment_status,
      status: order.status,
      warehouse: order.warehouse,
      staff: order.staff,
      user_details: {
        firstName: order.firstName,
        lastName: order.lastName,
        middleName: order.middleName,
        phone: order.phone,
        email: order.email,
        comment: order.comment,
      },
      delivery_details: {
        country: order.country,
        city: order.city,
        street: order.street,
        house: order.house,
        building: order.building,
        apartment_office: order.apartment_office,
        zip_code: order.zip_code,
      },
    };
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const orderToUpdate = await this.findOne(id);
    console.log('orderToUpdate', orderToUpdate);

    // const updatedWarehouse = await this.warehouseRepository.findOne({
    //   where: {
    //     id: updateOrderDto.warehouse,
    //   },
    // });
    //
    // const updatedStaff = await this.staffRepository.findOne({
    //   where: {
    //     id: updateOrderDto.staff,
    //   },
    // });

    orderToUpdate.firstName =
      updateOrderDto.user_details.firstName ?? orderToUpdate.firstName;
    orderToUpdate.lastName =
      updateOrderDto.user_details.lastName ?? orderToUpdate.lastName;
    orderToUpdate.middleName =
      updateOrderDto.user_details.middleName ?? orderToUpdate.middleName;
    orderToUpdate.email =
      updateOrderDto.user_details.email ?? orderToUpdate.email;
    orderToUpdate.phone =
      updateOrderDto.user_details.phone ?? orderToUpdate.phone;
    orderToUpdate.comment =
      updateOrderDto.user_details.comment ?? orderToUpdate.comment;
    orderToUpdate.total_price = 0;
    orderToUpdate.status = updateOrderDto.status ?? orderToUpdate.status;

    return await this.orderRepository.save(orderToUpdate);
  }
}
