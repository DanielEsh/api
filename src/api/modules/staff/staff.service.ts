import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CrudService,
  ICrudService,
  PaginationsParams,
} from '../../../shared/crud';
import { Staff } from './entity/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
  protected readonly crudService: ICrudService<Staff>;

  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {
    this.crudService = new CrudService<Staff>(this.staffRepository, 'staff');
  }

  async create(createStaffDto: CreateStaffDto) {
    const newStaff = new Staff();

    newStaff.first_name = createStaffDto.first_name;
    newStaff.last_name = createStaffDto.last_name;
    newStaff.middle_name = createStaffDto.middle_name;
    newStaff.email = createStaffDto.email;
    newStaff.phone = createStaffDto.phone;

    return await this.staffRepository.save(newStaff);
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

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    const staffToUpdate = await this.findOneById(id);

    staffToUpdate.first_name = updateStaffDto.first_name;
    staffToUpdate.last_name = updateStaffDto.last_name;
    staffToUpdate.middle_name = updateStaffDto.middle_name;
    staffToUpdate.email = updateStaffDto.email;
    staffToUpdate.phone = updateStaffDto.phone;

    return await this.staffRepository.save(staffToUpdate);
  }
}
