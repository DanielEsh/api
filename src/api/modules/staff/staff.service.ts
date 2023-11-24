import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
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

    newStaff.nickname = createStaffDto.nickname;
    newStaff.first_name = createStaffDto.first_name;
    newStaff.last_name = createStaffDto.last_name;
    newStaff.middle_name = createStaffDto.middle_name;
    newStaff.email = createStaffDto.email;
    newStaff.phone = createStaffDto.phone;
    newStaff.password = this.encodePassword(createStaffDto.password);

    return await this.staffRepository.save(newStaff);
  }

  // Encode Staff's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  async findStaffByEmailOrNickName(
    payload: string,
  ): Promise<Staff | undefined> {
    console.log('PAYLOAD', payload);
    return (
      (await this.staffRepository.findOne({ where: { email: payload } })) ||
      this.staffRepository.findOne({ where: { nickname: payload } })
    );
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.update(userId, {
      hashedRefreshToken: hash,
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async findAll(options: PaginationsParams) {
    return await this.crudService.readAll(options);
  }

  async findOneById(id: number) {
    return await this.staffRepository.findOne({ where: { id } });
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
