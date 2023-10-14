import { PartialType } from '@nestjs/swagger';
import { RoleCrateDto } from './role-crate.dto';

export class RoleUpdateDto extends PartialType(RoleCrateDto) {}
