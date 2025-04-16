// src/uploadthing/uploadthing.service.ts
import { Injectable } from '@nestjs/common';
import { UTApi, UTFile } from 'uploadthing/server';
import * as fs from 'fs';

@Injectable()
export class UploadthingService {
  private utapi: UTApi;

  constructor() {
    this.utapi = new UTApi({
      token: process.env.UPLOADTHING_TOKEN,
    });
  }

  async uploadVideo(filePath: string, fileName: string, mimeType: string): Promise<string> {
    console.log('token', process.env.UPLOADTHING_TOKEN);

    console.log(filePath);
    const fileContent = fs.readFileSync(filePath);
    const file = new UTFile([fileContent], fileName, {
      type: mimeType,
      customId: `trace-${Date.now()}`,
    });

    try {
      const response = await this.utapi.uploadFiles([file]);
      if (!response[0].data) {
        throw new Error('Upload failed: ' + response[0].error.message);
      }
      return response[0].data.ufsUrl;
    } catch (e) {
      throw new Error('Failed to upload video: ' + (e as Error).message);
    }
  }
}
