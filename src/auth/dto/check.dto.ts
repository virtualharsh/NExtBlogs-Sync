import { ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class CheckDto extends RegisterDto {
  @ApiProperty({
    example: 'harsh_sonegra',
    description: 'Username of the user',
  })
  username!: string;
}
