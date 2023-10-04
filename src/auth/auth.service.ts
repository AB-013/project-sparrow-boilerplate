import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import ms from 'ms';
import { IAuthConfig } from 'src/config/auth.config';

import { User } from '@src/users/user.entity';
import { UserService } from '@src/users/user.service';
import { AUTH_FAILED } from '@src/utils/error-messages';

import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { LoginResponseType } from './types/login-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException(AUTH_FAILED);
    }
    const compareResult = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!compareResult) {
      throw new UnauthorizedException(AUTH_FAILED);
    }

    return this.generateJwtToken(user);
  }

  async generateJwtToken(user: User): Promise<LoginResponseType> {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    const authConfig = this.configService.get<IAuthConfig>('auth');

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: authConfig.secret,
        expiresIn: authConfig.expires,
      }),
      expiresAt: Date.now() + ms(authConfig.expires),
    };
  }
}
