import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CrudService,
  ICrudService,
  PaginationsParams,
} from '../../../shared/crud';
import { RoleEntity } from './entity/role.entity';
import { RoleCrateDto } from './dto/role-crate.dto';
import { RoleUpdateDto } from './dto/role-update.dto';

@Injectable()
export class RoleService {
  protected readonly crudService: ICrudService<RoleEntity>;
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    this.crudService = new CrudService<RoleEntity>(this.roleRepository, 'role');
  }

  public async create(dto: RoleCrateDto) {
    const newRole = new RoleEntity();

    newRole.name = dto?.name;
    newRole.permissions = dto.permissions;

    return this.roleRepository.save(newRole);
  }

  public async findAll(options: PaginationsParams) {
    return await this.crudService.readAll(options);
  }

  async findById(id: number): Promise<RoleEntity | undefined> {
    return await this.roleRepository.findOne({ where: { id } });
  }

  public async updateUserById(id: number, dto: RoleUpdateDto) {
    const currentRole = await this.findById(id);

    currentRole.name = dto?.name;
    currentRole.permissions = dto.permissions;

    return this.roleRepository.save(currentRole);
  }

  async remove(id: number) {
    return await this.crudService.delete({
      name: 'id',
      value: id,
    });
  }
}
