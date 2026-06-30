import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UpdateUserDto, UpdateUserWalletDto, ResetPasswordDto } from './admin.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}



  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.adminService.updateUser(id, body);
  }

  @Post('users/:id/wallet')
  updateUserWallet(@Param('id') id: string, @Body() body: UpdateUserWalletDto) {
    return this.adminService.updateUserWallet(id, body.action, body.walletType, body.amount, body.note);
  }

  @Post('users/:id/password')
  resetUserPassword(@Param('id') id: string, @Body() body: ResetPasswordDto) {
    return this.adminService.resetUserPassword(id, body.newPassword);
  }

  @Get('kyc')
  getKycApplications() {
    return this.adminService.getKycApplications();
  }

  @Get('reports')
  getReports() {
    return this.adminService.getReports();
  }
}
