import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAttributeDto {
  @ApiProperty({
    example: 'example name',
    description: 'Name of the attribute',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '',
    description: 'Value of the attribute',
    required: false,
  })
  value?: string;

  @ApiProperty({
    example: '',
    description: 'Descripton of the category',
    required: false,
  })
  description?: string;
}
