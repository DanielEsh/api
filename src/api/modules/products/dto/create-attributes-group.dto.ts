import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { AttributesGroupAttribute } from '../entities/product-attribute-group.entity';

export class CreateAttributesGroupDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsArray()
  public attributes: AttributesGroupAttribute[];
}
