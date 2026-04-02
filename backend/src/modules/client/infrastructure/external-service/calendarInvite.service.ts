type IcsInviteInput = {
  uid: string;
  startTime: Date;
  durationMinutes: number;
  summary: string;
  description: string;
  location: string;
  organizerEmail?: string;
  attendeeEmail?: string;
};

export type CalendarInviteAttachment = {
  filename: string;
  contentType: string;
  content: Buffer;
};

const pad2 = (n: number) => String(n).padStart(2, '0');

const toUtcIcsDateTime = (d: Date): string => {
  const dt = new Date(d);
  return (
    dt.getUTCFullYear().toString() +
    pad2(dt.getUTCMonth() + 1) +
    pad2(dt.getUTCDate()) +
    'T' +
    pad2(dt.getUTCHours()) +
    pad2(dt.getUTCMinutes()) +
    pad2(dt.getUTCSeconds()) +
    'Z'
  );
};

const escapeIcsText = (s: string): string =>
  (s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\n|\r/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

const foldIcsLine = (line: string): string => {
  const max = 74;
  if (line.length <= max) return line;
  let out = '';
  let i = 0;
  while (i < line.length) {
    const chunk = line.slice(i, i + max);
    out += (i === 0 ? chunk : `\r\n ${chunk}`);
    i += max;
  }
  return out;
};

export const buildInterviewCalendarInvite = (input: IcsInviteInput): CalendarInviteAttachment => {
  const now = new Date();
  const start = new Date(input.startTime);
  const end = new Date(start.getTime() + input.durationMinutes * 60 * 1000);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HR-AGENT//Interview//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${escapeIcsText(input.uid)}`,
    `DTSTAMP:${toUtcIcsDateTime(now)}`,
    `DTSTART:${toUtcIcsDateTime(start)}`,
    `DTEND:${toUtcIcsDateTime(end)}`,
    `SUMMARY:${escapeIcsText(input.summary)}`,
    `DESCRIPTION:${escapeIcsText(input.description)}`,
    `LOCATION:${escapeIcsText(input.location)}`,
    'STATUS:CONFIRMED',
  ];

  if (input.organizerEmail) {
    lines.push(`ORGANIZER:MAILTO:${escapeIcsText(input.organizerEmail)}`);
  }
  if (input.attendeeEmail) {
    lines.push(`ATTENDEE;RSVP=TRUE:MAILTO:${escapeIcsText(input.attendeeEmail)}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');

  const ics = lines.map(foldIcsLine).join('\r\n') + '\r\n';

  return {
    filename: 'interview.ics',
    contentType: 'text/calendar; charset=utf-8; method=REQUEST',
    content: Buffer.from(ics, 'utf-8'),
  };
};

