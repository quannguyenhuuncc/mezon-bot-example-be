import { Injectable, Logger } from '@nestjs/common';
import {
  ApiChannelDescription,
  ApiMessageAttachment,
  ApiMessageMention,
  ApiMessageRef,
  ChannelMessageContent,
  MezonClient,
  TokenSentEvent,
} from 'mezon-sdk';

@Injectable()
export class MezonService {
  private readonly logger = new Logger(MezonService.name);
  private readonly client: MezonClient;

  constructor(clientConfigs: MezonClientConfig) {
    this.client = new MezonClient(clientConfigs.token);
  }

  async initializeClient() {
    try {
      this.logger.log('Initializing client');
      const result = await this.client.authenticate();
      this.logger.log('Authentication successful', result);
    } catch (error) {
      this.logger.error('Authentication error', error);
      throw error;
    }
  }

  getClient() {
    return this.client;
  }

  createDMchannel(mezonUserId: string) {
    return this.client
      .createDMchannel(mezonUserId)
      .then((res: ApiChannelDescription) => ({
        channelId: res.channel_id,
        ...res,
      }))
      .catch(error => {
        this.logger.error('Error creating DM channel:');
        this.logger.error('Params: mezonUserId = ', mezonUserId);
        this.logger.error('Error log:', error);
        throw error;
      });
  }

  listChannelVoiceUsers(params: ListChannelVoiceUsersParams) {
    return this.client
      .listChannelVoiceUsers(
        params.clanId,
        params.channelId,
        params.channelType,
        params.limit,
        params.state,
        params.cursor,
      )
      .then(response =>
        response.voice_channel_users?.map(user => ({
          mezonUserId: user.user_id,
          ...user,
        })),
      )
      .catch(error => {
        this.logger.error('Error listing channel voice users:');
        this.logger.error('Params:', JSON.stringify(params, null, 2));
        this.logger.error('Error log:', error);
        throw error;
      });
  }

  reactionMessage(params: ReactMessageParams) {
    return this.client
      .reactionMessage(
        params.id || '',
        params.clan_id,
        params.channel_id,
        params.mode,
        params.is_public,
        params.message_id,
        params.emoji_id,
        params.emoji,
        params.count,
        params.message_sender_id,
        params.action_delete || false,
      )
      .catch(error => {
        this.logger.error('Error reacting to message:');
        this.logger.error('Params:', JSON.stringify(params, null, 2));
        this.logger.error('Error log:', error);
        throw error;
      });
  }

  sendDMChannelMessage(messageToUser: {
    channelDmId: string;
    textContent?: string;
    messOptions?: Record<string, any>;
    attachments?: any[];
    refs?: any[];
    code?: number;
  }) {
    this.client.sendDMChannelMessage(
      messageToUser.channelDmId,
      messageToUser.textContent ?? '',
      messageToUser.messOptions ?? {},
      messageToUser.attachments ?? [],
      messageToUser.refs ?? [],
      messageToUser?.code,
    );
  }

  sendMessageToUser(messageToUser: {
    channelDmId: string;
    textContent: string;
    messOptions?: Record<string, any>;
  }) {
    this.client.sendDMChannelMessage(
      messageToUser.channelDmId,
      messageToUser.textContent,
      messageToUser.messOptions,
    );
  }

  sendMessage(params: {
    clan_id: string;
    channel_id: string;
    mode: number;
    is_public: boolean;
    msg: ChannelMessageContent;
    mentions?: Array<ApiMessageMention>;
    attachments?: Array<ApiMessageAttachment>;
    ref?: Array<ApiMessageRef>;
    anonymous_message?: boolean;
    mention_everyone?: boolean;
    avatar?: string;
    code?: number;
    topic_id?: string;
  }) {
    return this.client.sendMessage(
      params.clan_id,
      params.channel_id,
      params.mode,
      params.is_public,
      params.msg,
      params.mentions,
      params.attachments,
      params.ref,
      params.anonymous_message,
      params.mention_everyone,
      params.avatar,
      params.code,
      params.topic_id,
    );
  }

  updateChatMessage(params: {
    clan_id: string;
    channel_id: string;
    mode: number;
    is_public: boolean;
    message_id: string;
    content: ChannelMessageContent;
    mentions?: Array<ApiMessageMention>;
    attachments?: Array<ApiMessageAttachment>;
    hideEditted?: boolean;
  }) {
    return this.client.updateChatMessage(
      params.clan_id,
      params.channel_id,
      params.mode,
      params.is_public,
      params.message_id,
      params.content,
      params.mentions,
      params.attachments,
      params.hideEditted || false,
    );
  }

  sendToken(tokenSentEvent: TokenSentEvent) {
    return this.client.sendToken(tokenSentEvent);
  }
}
