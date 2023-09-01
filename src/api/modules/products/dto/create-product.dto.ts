import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'article',
    description: 'Product article',
    required: true,
  })
  @IsNotEmpty()
  public article: string;

  @ApiProperty({
    example: 'name',
    description: 'Product name',
    required: true,
  })
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    example: '5000',
    description: 'Product price',
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  public price: number;

  @ApiProperty({
    example: '',
    description: 'Product description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'Product brand',
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  public brandId: number;

  @ApiProperty({
    example: 2,
    description: 'Product category',
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  public categoryId: number;

  @ApiProperty({
    example: [],
    description: 'Product attribute group',
    required: false,
  })
  public attributeGroup?: any[];
}
