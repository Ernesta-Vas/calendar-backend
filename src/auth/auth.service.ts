import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../interfaces/user.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { ...result } = user;
      return result as User;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.dataValues.username,
      sub: user.dataValues.id,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      access_token,
      refresh_token,
      username: user.dataValues.username,
    };
  }

  async getProfile(id: number) {
    const user = await this.usersService.findOneById(id);
    if (user) {
      const userObject = user.toJSON();
      delete userObject.password;
      return userObject;
    }
    return null;
  }

  async refreshToken(refreshToken: string) {
    try {
      console.log(refreshToken, 'refresh');
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOneById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const access_token = this.jwtService.sign(
        { sub: user.id, username: user.username },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      );
      const new_refresh_token = this.jwtService.sign(
        { sub: user.id, username: user.username },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      );

      return { access_token, refresh_token: new_refresh_token };
    } catch (e) {
      console.log(e, 'error');
      throw new UnauthorizedException('Invalid token');
    }
  }
}
