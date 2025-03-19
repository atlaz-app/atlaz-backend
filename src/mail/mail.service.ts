import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailConfirmation(newUser: { email: string; username: string; verificationCode: string }): Promise<void> {
    await this.mailerService.sendMail({
      to: newUser.email,
      from: 'info@muscle-meter.com',
      subject: 'Email confirmation ✔',
      template: 'confirmation',
      context: {
        username: newUser.username,
        verificationCode: newUser.verificationCode,
      },
    });
  }
}
