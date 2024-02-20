import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/db/prisma/prisma.service';
import isEmail from 'validator/lib/isEmail';
import { UsersLogInDto, UsersSignUpDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly PrismaService: PrismaService) {} //nest가 DI 를 해서 인자로 프리즈마 넣어주고, this. 연결해줌

  async signUp(dto: UsersSignUpDto) {
    const { email, password } = dto;
    if (!email.trim()) throw new Error('No email');
    if (!isEmail(email)) throw new Error('Invalid email');
    if (!password.trim()) throw new Error('No password');
    if (password.length < 4) throw new Error('Too short password');

    const encryptedPassword = await hash(password, 12);

    const user = await this.PrismaService.user.create({
      data: {
        email,
        encryptedPassword,
        profile: {
          create: {},
        },
        cart: {
          create: {},
        },
      },
    });
    const accessToken = this.generateAccessToken(user);

    return { accessToken };
  }

  async logIn(dto: UsersLogInDto) {
    const { email, password } = dto;

    if (!email.trim()) throw new Error('No email');
    if (!isEmail(email)) throw new Error('Invalid email');
    if (!password.trim()) throw new Error('No password');
    if (password.length < 4) throw new Error('Too short password');

    const user = await this.PrismaService.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error('No User');

    try {
      await compare(password, user.encryptedPassword);
    } catch (e) {
      throw new Error('Invalid password');
    }

    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  }

  generateAccessToken(user: Pick<User, 'id' | 'email'>) {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    const accessToken = sign({ email: user.email }, JWT_SECRET_KEY, {
      subject: String(user.id),
      expiresIn: '5m',
    });

    return accessToken;
  }

  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update() {
    return;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
