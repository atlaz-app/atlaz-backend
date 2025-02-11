import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI;

  async onModuleInit(): Promise<void> {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  async generateResponse({ message }: { message: string }) {
    const chatCompletion = await this.client.chat.completions.create({
      messages: [{ role: 'system', content: message }],
      model: 'gpt-4',
    });
    return { message: chatCompletion };
  }
}
