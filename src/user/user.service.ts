import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(newUser: {
    email: string;
    username: string;
    age: number;
    experienceYears?: number;
    password: string;
    verificationCode: string;
    isEmailVerified: boolean;
  }) {
    const createdUser = await this.prisma.user.create({ data: newUser });
    return createdUser;
  }

  async findAll() {
    return await this.prisma.user.findMany({ omit: { password: true } });
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  }

  updateById(
    id: number,
    updatedUser: {
      email?: string;
      username?: string;
      age?: number;
      experienceYears?: number;
      password?: string;
      verificationCode?: string;
      isEmailVerified?: boolean;
    },
  ) {
    return `This action updates a #${updatedUser.email} user`;
  }

  async verifyEmail(emailVerification: { email: string; code: string }) {
    const { email, code } = emailVerification;

    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
        verificationCode: code,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification code or email.');
    }

    const verifiedNewUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationCode: null,
      },
    });

    return verifiedNewUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    const users = await this.prisma.user.findUnique({
      where: { email: email },
    });
    return users;
  }

  async findByVerifiedEmail(email: string) {
    const users = await this.prisma.user.findUnique({
      where: { email: email, isEmailVerified: true },
    });
    return users;
  }

  async updateUserRefreshToken(userId: number, token: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: token,
      },
    });
  }

  async deleteById(id: number) {
    await this.prisma.user.delete({ where: { id } });
  }
}
