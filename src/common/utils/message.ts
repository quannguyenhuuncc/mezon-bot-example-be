import {
  ApiMessageRef,
  ChannelMessage,
  ChannelMessageContent,
  EButtonMessageStyle,
  EMarkdownType,
  EMessageComponentType,
} from 'mezon-sdk';
import { getOptionalFields } from './helper';
import { MEZON_EMBED_FOOTER } from '../constants';
import { EMessageMode } from '../enums/mezon.enum';

// Common interfaces
interface BaseOption {
  label: string;
}

interface ButtonOption extends BaseOption {
  id: string;
  style?: EButtonMessageStyle;
}

interface SelectOption extends BaseOption {
  value: string | number;
}

interface ComponentBase {
  id: string;
  type: EMessageComponentType;
}

interface EmbedField {
  name: string;
  value: string;
  inputs?: ComponentBase & {
    component: any;
  };
}

// Message factory class
class MessageFactory {
  static createReplyMessage(
    messageContent: string,
    msg: ChannelMessage,
    type?: EMarkdownType,
  ) {
    return {
      contentText: messageContent,
      channelId: msg.channel_id,
      isPublic: msg.is_public ?? false,
      channelMode: msg.mode ?? EMessageMode.CHANNEL_MESSAGE,
      type: type || EMarkdownType.TRIPLE,
      clanId: msg.clan_id ?? '=',
      refs: this.createMessageRef(msg),
    };
  }

  static createChannelMessageContent(
    message: string,
    blockMessage: boolean,
  ): ChannelMessageContent {
    const messageContent = blockMessage ? `\`\`\`${message}\`\`\`` : message;
    const markdownConfig = blockMessage
      ? [{ type: EMarkdownType.TRIPLE, s: 0, e: messageContent.length }]
      : [];

    return {
      t: messageContent,
      mk: markdownConfig,
      ...getOptionalFields({ messageContent }),
    };
  }

  static createMessageRef(msg: ChannelMessage): ApiMessageRef[] {
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
        has_attachment: Boolean(msg.attachments?.length),
      },
    ];
  }
}

// Component factory class
class ComponentFactory {
  static createButtonComponents(
    buttonGroups: Array<{ buttons: ButtonOption[] }>,
  ) {
    return buttonGroups.map(({ buttons }) => ({
      components: buttons.map(({ id, label, style }) => ({
        id,
        type: EMessageComponentType.BUTTON,
        component: {
          label,
          style: style ?? EButtonMessageStyle.PRIMARY,
        },
      })),
    }));
  }

  static createSelectComponents(
    selects: Array<{ id: string; options: SelectOption[] }>,
    defaultValue?: SelectOption,
  ) {
    return selects.map(({ id, options }) => ({
      components: [
        {
          id,
          type: EMessageComponentType.SELECT,
          component: {
            options,
            required: true,
            valueSelected: defaultValue,
          },
        },
      ],
    }));
  }

  static createEmbedMessage(params: {
    title: string;
    color?: string;
    footer?: { text: string; icon_url?: string };
    fields: EmbedField[];
    timestamp?: string;
  }) {
    const { title, color, footer, fields, timestamp } = params;
    return [
      {
        color,
        title,
        fields,
        timestamp: timestamp ?? new Date().toISOString(),
        footer: footer ?? MEZON_EMBED_FOOTER,
      },
    ];
  }

  static createInputEmbed({
    label,
    id,
    value = '',
    placeholder,
    required,
    textarea,
    defaultValue,
  }: {
    label: string;
    id: string;
    value?: string;
    placeholder?: string;
    required: boolean;
    textarea?: boolean;
    defaultValue?: string;
  }): EmbedField {
    return {
      name: label,
      value,
      inputs: {
        id,
        type: EMessageComponentType.INPUT,
        component: {
          id,
          placeholder,
          required,
          textarea,
          defaultValue,
        },
      },
    };
  }

  static createSelectEmbed({
    label,
    id,
    options,
    value = '',
    required,
    valueSelected,
  }: {
    label: string;
    id: string;
    options: SelectOption[];
    value?: string;
    required?: boolean;
    valueSelected?: SelectOption;
  }): EmbedField {
    return {
      name: label,
      value,
      inputs: {
        id,
        type: EMessageComponentType.SELECT,
        component: {
          options,
          required,
          valueSelected,
        },
      },
    };
  }

  static createRadioEmbed(
    id: string,
    name: string,
    options: Array<{
      label: string;
      value: string | number;
      description?: string;
      style?: EButtonMessageStyle;
    }>,
  ) {
    return {
      name,
      value: '',
      inputs: {
        id,
        name,
        type: EMessageComponentType.RADIO,
        component: options,
      },
    };
  }
}

// Export factory methods
export const generateReplyMessage = ({
  messageContent,
  msg,
  type,
}: {
  messageContent: string;
  msg: ChannelMessage;
  type?: EMarkdownType;
}) => MessageFactory.createReplyMessage(messageContent, msg, type);

export const generateChannelMessageContent = ({
  message,
  blockMessage,
}: {
  message: string;
  blockMessage: boolean;
}) => MessageFactory.createChannelMessageContent(message, blockMessage);

export const generateMessageRef = (msg: ChannelMessage) =>
  MessageFactory.createMessageRef(msg);

export const generateButtonMessageComponents = ({
  buttonGroups,
}: {
  buttonGroups: Array<{ buttons: ButtonOption[] }>;
}) => ComponentFactory.createButtonComponents(buttonGroups);

export const generateSelectMessageComponents = ({
  selects,
  defaultValue,
}: {
  selects: Array<{ id: string; options: SelectOption[] }>;
  defaultValue?: SelectOption;
}) => ComponentFactory.createSelectComponents(selects, defaultValue);

export const generateEmbedMessage = ComponentFactory.createEmbedMessage;

export const generateInputEmbedMessage = ComponentFactory.createInputEmbed;

export const generateSelectEmbedMessage = ComponentFactory.createSelectEmbed;

export const generateRadioEmbedMessage = ({
  id,
  name,
  options,
}: {
  id: string;
  name: string;
  options: Array<{
    label: string;
    value: string | number;
    description?: string;
    style?: EButtonMessageStyle;
  }>;
}) => ComponentFactory.createRadioEmbed(id, name, options);

export const addTagChannelInMessage = (
  messageContent: string,
  channels: {
    name: string;
    id: string;
  }[],
) =>
  channels.map(item => {
    messageContent += `#${item.name} `;
    return {
      channelid: item.id,
      s: messageContent.length - (2 + item.name.length),
      e: messageContent.length - 1,
    };
  });
interface MentionUser {
  username: string;
  id: string;
}

export const addMentionsInMessage = (
  users: MentionUser[],
  messageContent: string,
  joinStr: string
) => {
  return users.map((user, index) => {
    const previousMention = index > 0
      ? users[index - 1].username?.length || users[index - 1].id.length
      : 0;

    const startPosition = index === 0
      ? messageContent.length - 1
      : messageContent.length + (previousMention * index) + (joinStr.length * index);

    const mentionLength = user.username?.length || user.id.length;

    return {
      user_id: user.id,
      s: startPosition,
      e: startPosition + mentionLength + 2
    };
  });
};
