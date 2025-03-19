import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from './ai/ai.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TraceModule } from './trace/trace.module';
import { PresetModule } from './preset/preset.module';

@Module({
  imports: [
    TraceModule,
    PresetModule,
    UserModule,
    AuthModule,
    AiModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: __dirname + '/mail/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [PrismaService],
})
export class AppModule {}
