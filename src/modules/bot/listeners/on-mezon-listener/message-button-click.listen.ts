import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Events } from 'mezon-sdk';

@Injectable()
export class MessageButtonClickListener {
  private readonly logger = new Logger(MessageButtonClickListener.name);

  constructor(private eventEmitter: EventEmitter2) { }

  @OnEvent(Events.MessageButtonClicked)
  async handleMessageButtonClick(payload: ButtonClickPayload) {
    const { button_id } = payload;
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);
    const [idText, buttonActionFeature, ...params] = button_id.split('_');
    this.eventEmitter.emit(buttonActionFeature, {
      payload,
      params,
    });
  }
}
