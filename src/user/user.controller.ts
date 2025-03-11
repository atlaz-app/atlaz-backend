import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { AiService } from 'src/ai/ai.service';
import { CreatePresetDto, UpdateUserDto } from './user.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private aiService: AiService,
  ) {}

  @Get('info')
  async getUserInfo(@Req() req: Request) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('info')
  updateUserInfo(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateById(req.user.id, updateUserDto);
  }

  @Delete()
  deleteUser(@Req() req: Request) {
    return this.usersService.remove(req.user.id);
  }

  @Get('presets')
  async getPresets(@Req() req: Request) {
    return this.usersService.getPresets(req.user.id);
  }

  @Post('presets')
  async createPreset(
    @Req() req: Request,
    @Body() createPresetDto: CreatePresetDto,
  ) {
    return this.usersService.createPreset(req.user.id, createPresetDto);
  }

  @Delete('presets/:id')
  async deletePreset(@Req() req: Request, @Param('id') id: string) {
    console.log(id);
    return this.usersService.deletePreset(req.user.id, +id);
  }

  @Public()
  @Post('/chat')
  async chat(@Body() body: { message: string }) {
    const chatCompletion = await this.aiService.generateResponse({
      message: body.message,
    });
    return { message: chatCompletion };
  }
}
