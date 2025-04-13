import {
  ApiMessageRef,
  ChannelMessage,
  ChannelMessageContent,
  EMarkdownType,
} from 'mezon-sdk';
import { getOptionalFields } from './helper';

export function generateReplyMessage({
  messageContent,
  msg,
}: {
  messageContent: string;
  msg: ChannelMessage;
}): MessageForChannel {
  return {
    contentText: messageContent,
    channelId: msg.channel_id,
    isPublic: msg.is_public,
    channelMode: msg.mode,
    type: EMarkdownType.TRIPLE,
    clanId: msg.clan_id,
    refs: refGenerate(msg),
  } as MessageForChannel;
}

export function generateChannelMessageContent({
  message,
  blockMessage,
}: {
  message: string;
  blockMessage: boolean;
}): ChannelMessageContent {
  const messageContent = blockMessage ? `\`\`\`${message}\`\`\`` : message;
  return {
    t: messageContent,
    mk: blockMessage
      ? [{ type: EMarkdownType.TRIPLE, s: 0, e: messageContent.length }]
      : [],
    ...getOptionalFields({ messageContent: messageContent }),
  };
}

export function refGenerate(msg: ChannelMessage): Array<ApiMessageRef> {
  return [
    {
      message_id: '',
      message_ref_id: msg.message_id,
      ref_type: 0,
      message_sender_id: msg.sender_id,
      message_sender_username: msg.username,
      mesages_sender_avatar: msg.avatar,
      message_sender_clan_nick: msg.clan_nick,
      message_sender_display_name: msg.display_name,
      content: JSON.stringify(msg.content),
      has_attachment: !!msg?.attachments?.length || false,
    },
  ];
}
