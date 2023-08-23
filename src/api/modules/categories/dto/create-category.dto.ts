import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  name: string;

  description?: string;
}
