import { Injectable, Logger } from '@nestjs/common';
import {
  ApiMessageReaction,
  MezonClient,
  Events,
  ChannelMessage,
  TokenSentEvent,
  StreamingJoinedEvent,
  StreamingLeavedEvent,
} from 'mezon-sdk';

import {
  ChannelCreatedEvent,
  ChannelDeletedEvent,
  ChannelUpdatedEvent,
  UserChannelAddedEvent,
  UserChannelRemovedEvent,
  UserClanRemovedEvent,
} from 'mezon-sdk';
import { MezonService } from '../mezon/mezon.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);
  private client: MezonClient;

  constructor(
    clientService: MezonService,
    private eventEmitter: EventEmitter2,
  ) {
    this.client = clientService.getClient();
  }

  initEvent() {
    for (const event in Events) {
      const eventValue =
        Events[event] === 'clan_event_created'
          ? Events[event].replace(/_/g, '')
          : Events[event].replace(/_event/g, '').replace(/_/g, '');
      this.logger.log(`Init event ${eventValue}`);
      const key = `handle${eventValue}`;
      if (key in this) {
        this.client.on(Events[event], this[key], this);
      }
    }
  }

  handlewebrtcsignalingfwd = data => {
    console.log('handlewebrtcsignalingfwd', data);
  };

  handledropdownboxselected = data => {
    console.log('data', data);
  };

  handletokensent = (data: TokenSentEvent) => {
    this.eventEmitter.emit(Events.TokenSend, data);
  };

  handlemessagebuttonclicked = data => {
    this.eventEmitter.emit(Events.MessageButtonClicked, data);
  };

  handlestreamingjoined = (data: StreamingJoinedEvent) => {
    this.eventEmitter.emit(Events.StreamingJoinedEvent, data);
  };

  handlestreamingleaved = (data: StreamingLeavedEvent) => {
    this.eventEmitter.emit(Events.StreamingLeavedEvent, data);
  };

  handleclaneventcreated = data => {
    this.eventEmitter.emit(Events.ClanEventCreated, data);
  };

  handlemessagereaction = async (msg: ApiMessageReaction) => {
    this.eventEmitter.emit(Events.MessageReaction, msg);
  };

  handlechannelcreated = async (channel: ChannelCreatedEvent) => {
    this.eventEmitter.emit(Events.ChannelCreated, channel);
  };

  handleuserclanremoved(user: UserClanRemovedEvent) {
    this.eventEmitter.emit(Events.UserClanRemoved, user);
  }

  handlerole = data => {
    this.eventEmitter.emit(Events.RoleEvent, data);
  };

  handleroleassign = data => {
    this.eventEmitter.emit(Events.RoleAssign, data);
  };

  handleuserchanneladded = async (user: UserChannelAddedEvent) => {
    this.eventEmitter.emit(Events.UserChannelAdded, user);
  };

  handlechanneldeleted = async (channel: ChannelDeletedEvent) => {
    this.eventEmitter.emit(Events.ChannelDeleted, channel);
  };

  handlechannelupdated = async (channel: ChannelUpdatedEvent) => {
    this.eventEmitter.emit(Events.ChannelUpdated, channel);
  };

  handleuserchannelremoved = async (msg: UserChannelRemovedEvent) => {
    this.eventEmitter.emit(Events.UserChannelRemoved, msg);
  };

  handlegivecoffee = async data => {
    this.eventEmitter.emit(Events.GiveCoffee, data);
  };

  handleaddclanuser = async data => {
    this.eventEmitter.emit(Events.AddClanUser, data);
  };

  handleroleassigned = async msg => {
    console.log(msg);
  };

  handlechannelmessage = async (msg: ChannelMessage) => {
    ['attachments', 'mentions', 'references'].forEach(key => {
      if (!Array.isArray(msg[key])) msg[key] = [];
    });
    this.eventEmitter.emit(Events.ChannelMessage, msg);
  };
}
