export class CommandStorage {
  private static readonly commands = new Map<
    string,
    { commandClass: any; hiddenCommand: boolean }
  >();

  private static readonly botCommands = new Map<string, any>();

  public static registerCommand(
    commandName: string,
    commandClass: any,
    hiddenCommand = false,
  ) {
    this.commands.set(commandName, { commandClass, hiddenCommand });
  }

  public static registerBotCommand(commandName: string, commandClass: any) {
    this.botCommands.set(commandName, commandClass);
  }

  public static getBotCommand(commandName: string) {
    return this.botCommands.get(commandName);
  }

  public static getCommand(
    commandName: string,
  ): { commandClass: any; hiddenCommand: boolean } | undefined {
    return this.commands.get(commandName);
  }

  public static getVisibleCommandNames(): string[] {
    return Array.from(this.commands.keys()).filter(
      key => !this.commands.get(key)?.hiddenCommand,
    );
  }
}
