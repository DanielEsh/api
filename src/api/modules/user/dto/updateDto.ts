import { Role } from '@/api/auth/roles.enum';

export class UpdateDto {
  public readonly name?: string;
  public readonly email?: string;
  public readonly roles?: [Role];
  public readonly hashedRefreshToken: string;
}
