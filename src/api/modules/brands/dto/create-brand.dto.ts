import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    example: 'example-slug',
    description: 'Slug of the category',
    required: true,
  })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: 'example name',
    description: 'Name of the category',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '',
    description: 'Descripton of the category',
    required: false,
  })
  description?: string;
}
