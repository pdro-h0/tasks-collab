import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  GetUserByEmailDto,
  GetUserByIdDto,
} from './dto/create-user.dto';
import { CreateUser, GetUser } from '@tasks-collab/core/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../db/entities/user.entity';

@Injectable()
export class UsersRepository implements CreateUser, GetUser {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getByEmail(input: GetUserByEmailDto): Promise<User | null> {
    return this.userRepo.findOneBy({ email: input.email });
  }
  async getById(input: GetUserByIdDto): Promise<User | null> {
    return this.userRepo.findOneBy({ id: input.id });
  }
  async create(createUserDto: CreateUserDto) {
    await this.userRepo.save(createUserDto);
  }
}
