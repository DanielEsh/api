import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({
    example: 'user name 1',
    description: 'user name',
    required: true,
  })
  public readonly name: string;

  @ApiProperty({
    example: 'user@email.ru',
    description: 'user email',
    required: true,
  })
  public readonly email: string;

  @ApiProperty({
    example: 'user-name-1',
    description: 'user password',
    required: true,
  })
  public readonly password: string;
}
