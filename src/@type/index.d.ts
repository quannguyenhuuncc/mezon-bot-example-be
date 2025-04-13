import { ChannelMessageContent, EMarkdownType } from 'mezon-sdk';

declare global {
  type MezonClientConfig = {
    token: string;
  };

  interface MezonModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: unknown[]) => Promise<unknown> | unknown;
    inject?: unknown[];
  }

  interface AsteriskInterface {
    execute: (
      messageContent: string,
      message: ChannelMessage,
    ) => Promise<Array<MessageForChannel | MessageForUser>>;
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

  interface MessageForChannel {
    clanId: string;
    channelId: string;
    channelMode: EMessageMode;
    isPublic: boolean;
    type: EMarkdownType;
    contentText: string;
    refs: Array<ApiMessageRef>;
  }

  interface MessageForUser {
    mezonUserId: string;
    contentText: string;
  }

  type ReplyContentType = {
    messageContent?: string;
    clan_id?: string;
    channel_id?: string;
    mode?: number;
    is_public?: boolean;
    mentions?: unknown[];
    attachments?: unknown[];
    lk?: unknown;
    hg?: unknown; // for channel
    mk?: unknown; // for send message to user
    ej?: unknown;
    vk?: unknown;
    contentThread?: unknown;
  };
}

export {};
