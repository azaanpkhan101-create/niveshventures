import { IsString, IsOptional, IsEmail, IsEnum, IsNumber, Min } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsEnum(['ACTIVE', 'SUSPENDED'])
  @IsOptional()
  status?: string;
}

export class UpdateUserWalletDto {
  @IsEnum(['DEPOSIT', 'DEDUCT'])
  action: string;

  @IsEnum(['mineBalance', 'nodeBalance', 'capitalBalance'])
  walletType: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class ResetPasswordDto {
  @IsString()
  @Min(6)
  newPassword: string;
}
