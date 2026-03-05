import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'User email address',
  })
  email!: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'User password',
  })
  password!: string;
}
