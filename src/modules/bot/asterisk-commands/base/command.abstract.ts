import { ChannelMessage } from 'mezon-sdk';

export abstract class CommandBase {
  abstract execute(args: string[], message: ChannelMessage): Promise<any[]>;
}
