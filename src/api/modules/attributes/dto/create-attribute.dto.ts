import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AttributeType } from '../attributes.types';

export class CreateAttributeDto {
  @ApiProperty({
    example: 'example name',
    description: 'Name of the attribute',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: AttributeType.String,
    description: 'Type of the attribute',
    required: true,
  })
  @IsEnum(AttributeType)
  @IsNotEmpty()
  type: AttributeType;

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
