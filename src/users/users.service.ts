import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(username: string, password: string): Promise<UserDto> {
    const existingUser = await this.userModel.findOne({ where: { username } });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.userModel.create({
      username,
      password: hashedPassword,
    });

    const userDto: UserDto = {
      id: createdUser.id,
      username: createdUser.username,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };

    return userDto;
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }
}
