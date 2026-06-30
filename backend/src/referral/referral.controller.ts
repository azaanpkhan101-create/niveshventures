import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('stats')
  getStats(@Request() req) {
    return this.referralService.getReferralStats(req.user.sub);
  }
}
