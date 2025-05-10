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

export function toUtcTimestamp(dateString, timeString, timeZone) {
  // Combine date and time
  const localDateTime = `${dateString}T${timeString}`;

  // Create a date in the target time zone
  const localDate = new Date(
      new Intl.DateTimeFormat('en-US', {
          timeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
      }).format(new Date(localDateTime))
  );

  // Get the timestamp in milliseconds and convert to seconds
  return Math.floor(localDate.getTime());
}