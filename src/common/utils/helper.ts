export function getOptionalFields(replyContent: ReplyContentType) {
  const optionalFields = ['lk', 'hg', 'mk', 'ej', 'vk', 'contentThread'];

  return optionalFields.reduce((acc, field) => {
    if (field in replyContent) {
      acc[field] = replyContent[field];
    }
    return acc;
  }, {});
}

export function getRandomColor(): string {
  const colors = [
    '#1ABC9C',
    '#11806A',
    '#57F287',
    '#1F8B4C',
    '#3498DB',
    '#206694',
    '#9B59B6',
    '#71368A',
    '#E91E63',
    '#AD1457',
    '#F1C40F',
    '#C27C0E',
    '#E67E22',
    '#A84300',
    '#ED4245',
    '#992D22',
    '#95A5A6',
    '#979C9F',
    '#7F8C8D',
    '#BCC0C0',
    '#34495E',
    '#2C3E50',
    '#FFFF00',
  ];
  return random(colors);
}

export function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function showIf<T>(condition: boolean, value: T): T | undefined {
  return condition ? value : typeof value === 'string' ? ('' as T) : undefined;
}

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toUtcTimestamp(dateString: string, timeString: string, timeZone: string): number {
  const localDate = new Date(`${dateString}T${timeString}`);
  const utcTimestamp = localDate.getTime() - (localDate.getTimezoneOffset() * 60000);
  return Math.floor(utcTimestamp / 1000);
}

// Hàm này sẽ trả về 2 phần tử là 15 phút trước và thời điểm hiện tại, trả về dưới dạng timestamp utc
export function getLast15MinutesTimestamp(): [number, number] {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const nowTimestamp = Math.floor(now.getTime() / 1000);
  const fifteenMinutesAgoTimestamp = Math.floor(fifteenMinutesAgo.getTime() / 1000);
  return [fifteenMinutesAgoTimestamp, nowTimestamp];
}
