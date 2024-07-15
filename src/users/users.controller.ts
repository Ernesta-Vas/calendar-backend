import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body): Promise<UserDto> {
    return this.usersService.create(body.username, body.password);
  }
}
