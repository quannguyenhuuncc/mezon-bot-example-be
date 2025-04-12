import { ChannelMessageContent } from 'mezon-sdk';

declare global {
  type MezonClientConfig = {
    token: string;
  };

  interface MezonModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => Promise<any> | any;
    inject?: any[];
  }

  interface AsteriskInterface {
    execute: (
      messageContent: string,
      message: ChannelMessage,
    ) => Promise<ReplyMezonMessage[]>;
  }

  interface ListChannelVoiceUsersParams {
    clanId: string;
    channelId: string;
    channelType: number;
    limit?: number;
    state?: number;
    cursor?: string;
  }

  interface ReactMessageParams {
    id: string;
    clan_id: string;
    channel_id: string;
    mode: number;
    is_public: boolean;
    message_id: string;
    emoji_id: string;
    emoji: string;
    count: number;
    message_sender_id: string;
    action_delete: boolean;
  }
}

export {};
