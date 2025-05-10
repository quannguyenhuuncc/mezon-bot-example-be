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
  ADD_VOICE_CHANNELS = 'add_voice_channels',
  MENTION = 'mention',
  REMIND = 'remind',
}

export enum BOT_BUTTON_ACTION_FEATURES {
  UPDATE_MESSAGE_EXECUTE = 'update-message-execute',
  BUTTON_MESSAGE_COMPONENT_EXECUTE = 'button-message-component-execute',
  EMBED_EXECUTE = 'embed-execute',
  SELECT_MESSAGE_COMPONENT_EXECUTE = 'select-message-component-execute',
}

export enum BOT_TABLES {
  // bot tables
  CONFIG = 'bot_config',
  BOT_MESSAGE = 'bot_messages',
  USER = 'users',
  REMIND = 'reminds',

  // mezon tables
  MEZON_CHANNELS = 'mezon_channels',
  MEZON_USER = 'mezon_users',
  VOICE_CHANNEL = 'mezon_voice_channels',
}
