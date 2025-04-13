export class MessageQueueStore {
  private readonly queue: Array<MessageForChannel | MessageForUser> = [];
  getMessageQueue() {
    return this.queue;
  }
  addMessage(message: MessageForChannel | MessageForUser) {
    this.queue.push(message);
  }
  addMessages(messages: Array<MessageForChannel | MessageForUser>) {
    this.queue.push(...messages);
  }
  getNextMessage(): MessageForChannel | MessageForUser | undefined {
    return this.queue.shift();
  }
  hasMessages(): boolean {
    return this.queue.length > 0;
  }
}
