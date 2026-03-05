import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class CheckDto extends PartialType(RegisterDto) {
  username!: string | null | undefined;
}
