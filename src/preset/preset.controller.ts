import { Controller, Get, Post, Body, Delete, Req, Param } from '@nestjs/common';

import { CreatePresetDto } from './preset.dto';
import { Request } from 'express';
import { PresetService } from './preset.service';

@Controller('presets')
export class PresetController {
  constructor(private readonly presetService: PresetService) {}

  @Get()
  async getPresets(@Req() req: Request) {
    return this.presetService.getPresets(req.user.id);
  }

  @Post('create')
  async createPreset(@Req() req: Request, @Body() createPresetDto: CreatePresetDto) {
    return this.presetService.createPreset(req.user.id, createPresetDto);
  }

  @Delete(':id')
  async deletePreset(@Req() req: Request, @Param('id') id: string) {
    console.log(id);
    return this.presetService.deletePreset(req.user.id, +id);
  }
}
