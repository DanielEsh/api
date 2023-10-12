import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/api/user/user.entity';
import { UpdateDto } from '@/api/user/dto/updateDto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async findAll() {
    return await this.userRepository.find();
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

  public async updateUserById(id: number, body: UpdateDto) {
    const user = await this.findById(id);

    user.name = body?.name || user.name;
    user.email = body?.email || user.email;
    user.roles = body?.roles || user.roles;
    user.hashedRefreshToken =
      body?.hashedRefreshToken || user.hashedRefreshToken;

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
