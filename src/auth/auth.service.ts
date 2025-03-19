import { Injectable, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateLogin({ email, enteredPassword }: { email: string; enteredPassword: string }) {
    const user = await this.userService.findByVerifiedEmail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist!');
    }

    const passwordMatches = await bcrypt.compare(enteredPassword, user.password);
    if (!passwordMatches) return null;

    return user;
  }

  async login(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '5m',
      secret: process.env.JWT_SECRET,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateUserRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registrationData: {
    email: string;
    username: string;
    age: number;
    experienceYears?: number;
    password: string;
  }) {
    const existingUser = await this.userService.findByEmail(registrationData.email);
    if (existingUser && existingUser.isEmailVerified) {
      throw new BadRequestException('Email is already in use');
    }

    if (existingUser && !existingUser.isEmailVerified) {
      await this.userService.deleteById(existingUser.id);
    }

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    const verificationCode = crypto.randomInt(100000, 1000000).toString();

    const newUser = await this.userService.create({
      ...registrationData,
      password: hashedPassword,
      verificationCode,
      isEmailVerified: false,
    });

    await this.mailService.sendEmailConfirmation(newUser);

    return { email: newUser.email };
  }

  async verifyEmail(emailVerificationData: { email: string; code: string }) {
    const newUser = await this.userService.verifyEmail(emailVerificationData);
    return this.login(newUser);
  }

  async refreshTokens({ userId, refreshToken }: { userId: number; refreshToken: string }) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.userService.updateUserRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
