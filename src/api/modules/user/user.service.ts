import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { UserUpdateDto } from './dto/user-update.dto';
import {
  CrudService,
  ICrudService,
  PaginationsParams,
} from '../../../shared/crud';

@Injectable()
export class UserService {
  protected readonly crudService: ICrudService<User>;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.crudService = new CrudService<User>(this.userRepository, 'user');
  }

  async findAll(options: PaginationsParams) {
    return await this.crudService.readAll(options);
  }

  async findUserByEmailOrName(payload: string): Promise<User | undefined> {
    return (
      (await this.userRepository.findOne({ where: { email: payload } })) ||
      this.userRepository.findOne({ where: { name: payload } })
    );
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { id } });
  }

  public async updateUserById(id: number, body: UserUpdateDto) {
    const user = await this.findById(id);

    user.name = body?.name || user.name;
    user.email = body?.email || user.email;

    return this.userRepository.save(user);
  }

  public async create(body) {
    const newUser = new User();

    if (!body.email && !body.password) {
      return 'Email/Password обязательные поля';
    }

    newUser.name = body?.name;
    newUser.email = body.email;
    newUser.password = this.encodePassword(body.password);

    return this.userRepository.save(newUser);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  public async delete(id: number) {
    await this.userRepository.delete({ id });
    return { deleted: true };
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.updateUserById(userId, {
      hashedRefreshToken: hash,
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }
}
