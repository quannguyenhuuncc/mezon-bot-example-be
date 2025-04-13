export enum BOT_CONFIG {
  COMMAND_PREFIX = 'COMMAND_PREFIX',
  BOT_NAME = 'BOT_NAME',
}

export const BOT_CONFIG_DYNAMIC_KEYS: Array<string> = [
  BOT_CONFIG.COMMAND_PREFIX,
  BOT_CONFIG.BOT_NAME,
];

export enum BOT_COMMANDS {
  HELP = 'help',
  PING = 'ping',
}
