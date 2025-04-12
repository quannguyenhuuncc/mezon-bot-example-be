export enum BOT_CONFIG {
  COMMAND_PREFIX = 'COMMAND_PREFIX',
}

export const BOT_CONFIG_DYNAMIC_KEYS: Array<string> = [
  BOT_CONFIG.COMMAND_PREFIX,
];

export enum BOT_COMMANDS {
  HELP = 'help',
  PING = 'ping',
}
