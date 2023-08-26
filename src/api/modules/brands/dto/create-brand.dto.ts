import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AttributeType } from '../../attributes/attributes.types';

export class CreateBrandDto {
  @ApiProperty({
    example: 'example-slug',
    description: 'Slug of the category',
    required: true,
  })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: AttributeType.String,
    description: 'Type of the attribute',
    required: true,
  })
  @IsEnum(AttributeType)
  @IsNotEmpty()
  public type: AttributeType;

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
