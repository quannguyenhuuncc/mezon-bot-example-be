import { CommandStorage } from './storage';

export function Command(commandName: string, hiddenCommand = false) {
  return function (target: any) {
    CommandStorage.registerCommand(commandName, target, hiddenCommand);
  };
}
