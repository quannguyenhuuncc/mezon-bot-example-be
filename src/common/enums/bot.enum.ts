export enum BOT_CONFIG {
  COMMAND_PREFIX = 'COMMAND_PREFIX',
  BOT_NAME = 'BOT_NAME',
  BOT_ID = 'BOT_ID',
}

export const BOT_CONFIG_DYNAMIC_KEYS: Array<string> = [
  BOT_CONFIG.COMMAND_PREFIX,
  BOT_CONFIG.BOT_NAME,
  BOT_CONFIG.BOT_ID,
];

export enum BOT_COMMANDS {
  HELP = 'help',
  PING = 'ping',
  WITHDRAW = 'withdraw',
  WD = 'wd',
  UPDATE_MESSAGE = 'update_message',
  BUTTON_MESSAGE_COMPONENT = 'button_message_component',
  EMBED = 'embed',
  SELECT_MESSAGE_COMPONENT = 'select_message_component',
}

export enum BOT_BUTTON_ACTION_FEATURES {
  UPDATE_MESSAGE_EXECUTE = 'update-message-execute',
  BUTTON_MESSAGE_COMPONENT_EXECUTE = 'button-message-component-execute',
  EMBED_EXECUTE = 'embed-execute',
  SELECT_MESSAGE_COMPONENT_EXECUTE = 'select-message-component-execute',
}

export enum BOT_TABLES {
  BOT_MESSAGE = 'mezon_bot_messages',
  CHANNELS = 'mezon_channels',
  USER = 'mezon_users',
}
