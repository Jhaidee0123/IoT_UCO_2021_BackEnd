import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto';
import { User } from '../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  public findById(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  public async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist.',
      HttpStatus.NOT_FOUND,
    );
  }

  public async create(user: CreateUserDto): Promise<void> {
    const newUser = await this.userRepository.create(user);
    await this.userRepository.save(newUser);
  }

  public async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
