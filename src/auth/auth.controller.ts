import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { AuthUser } from '@src/decorators/auth.user.decorator';
import { User } from '@src/users/user.entity';
import { UserService } from '@src/users/user.service';

import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginResponseType } from './types/login-response.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  login(@Body() loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    return this.authService.validateUser(loginDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async myProfile(@Request() request, @AuthUser() authUser): Promise<any> {
    const user = await this.userService.findById(authUser.sub);

    return {
      ...plainToClass(User, user),
      authUser,
    };
  }
}
