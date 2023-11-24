export class CreateStaffDto {
  nickname: string;
  first_name: string;
  last_name: string;
  password: string;
  middle_name?: string;
  phone?: number;
  email?: string;
}
