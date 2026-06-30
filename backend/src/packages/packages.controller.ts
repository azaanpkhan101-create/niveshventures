import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  getAllPackages() {
    return this.packagesService.getAllPackages();
  }

  @Get('my-packages')
  getUserPackages(@Request() req) {
    return this.packagesService.getUserPackages(req.user.sub);
  }

  @Post('purchase/:id')
  purchasePackage(@Request() req, @Param('id') packageId: string) {
    return this.packagesService.purchasePackage(req.user.sub, packageId);
  }
}
