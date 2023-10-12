import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AccessJwtAuthGuard, RolesGuard } from '@/api/auth/guards';
import { UserService } from '@/api/user/service/user.service';
import { Roles } from '@/api/auth/roles.decorator';
import { Role } from '@/api/auth/roles.enum';
import { UpdateDto } from '@/api/user/dto/updateDto';
import { CreateDto } from '@/api/user/dto/createDto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AccessJwtAuthGuard)
  @Get('')
  getAll(@Request() req) {
    return this.userService.findAll();
  }

  @Post('')
  async create(@Body() body: CreateDto) {
    return await this.userService.create(body);
  }

  @Put(':id')
  async updateById(@Param('id') id: number, @Body() body: UpdateDto) {
    await this.userService.updateUserById(id, body);
    return 'Success update';
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.userService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: `User deleted successfully`,
    };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const { user } = req;
    return 'Profile';
    // return this.userService.findById(user.id);
  }

  @Get('/guest/')
  guest() {
    console.log('123');
    return 'Guest route';
  }

  @UseGuards(AccessJwtAuthGuard, RolesGuard)
  @Get('admin')
  @Roles(Role.ADMIN)
  admin(@Request() req) {
    const { user } = req;
    return 'Admin route';
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.userService.findById(id);
  }
}
