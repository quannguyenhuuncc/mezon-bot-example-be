import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Events } from 'mezon-sdk';

@Injectable()
export class SendTokenListener {
  private readonly logger = new Logger(SendTokenListener.name);

  constructor(private eventEmitter: EventEmitter2) { }

  @OnEvent(Events.TokenSend)
  async handleTokenSend(params: any) {
    this.logger.log(`Sending token to ${JSON.stringify(params, null, 2)}`);
  }
}
