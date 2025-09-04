interface TimezoneOption {
  value: string;
  label: string;
  region: string;
}

// Track if we've already warned about manual offset calculation
let hasLoggedManualOffsetWarning = false;

// Helper function to manually calculate timezone offset string
const calculateOffsetManually = (timezone: string, date: Date): string => {
  try {
    // Log warning only once for QA visibility
    if (!hasLoggedManualOffsetWarning) {
      console.warn(
        'Timezone offset calculation: Falling back to manual calculation due to limited Intl.DateTimeFormat support'
      );
      hasLoggedManualOffsetWarning = true;
    }

    // Calculate offset in minutes
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const targetTime = new Date(
      date.toLocaleString('en-US', { timeZone: timezone })
    );
    const offsetMinutes = (utc - targetTime.getTime()) / 60000;

    // Convert to hours and minutes
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes <= 0 ? '+' : '-';

    // Format as GMT±HH:MM
    return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  } catch {
    return '';
  }
};

// Helper function to get timezone offset string
export const getTimezoneOffset = (timezone: string, date = new Date()) => {
  // Try shortOffset first (better browser compatibility)
  try {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((part) => part.type === 'timeZoneName');

    if (offsetPart?.value) {
      return offsetPart.value;
    }
  } catch {
    // shortOffset failed, continue to longOffset
  }

  // Try longOffset as fallback
  try {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    });
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((part) => part.type === 'timeZoneName');

    if (offsetPart?.value) {
      return offsetPart.value;
    }
  } catch {
    // longOffset failed, continue to manual calculation
  }

  // Both Intl methods failed, calculate manually
  return calculateOffsetManually(timezone, date);
};

// Helper function to get region from timezone name
export const getRegionFromTimezone = (timezone: string): string => {
  // Handle UTC specifically
  if (timezone === 'UTC') return 'UTC';

  const parts = timezone.split('/');
  if (parts.length < 2) return 'Other';

  const continent = parts[0];
  const regionMap: Record<string, string> = {
    America: 'Americas',
    Europe: 'Europe',
    Asia: 'Asia',
    Africa: 'Africa',
    Australia: 'Oceania',
    Pacific: 'Oceania',
    Indian: 'Indian Ocean',
    Atlantic: 'Atlantic',
    Antarctica: 'Antarctica',
  };

  return regionMap[continent] || 'Other';
};

// Helper function to get timezone offset in minutes for sorting
const getTimezoneOffsetMinutes = (timezone: string): number => {
  try {
    const date = new Date();
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const local = new Date(utc + 0);
    const target = new Date(
      local.toLocaleString('en-US', { timeZone: timezone })
    );
    return (utc - target.getTime()) / 60000;
  } catch {
    return 0;
  }
};

// Helper function to get display name for timezone
export const getTimezoneDisplayName = (timezone: string): string => {
  try {
    const city = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
    const offset = getTimezoneOffset(timezone);
    return `${city} (${offset})`;
  } catch {
    return timezone;
  }
};

// Helper function to sort timezones with precomputed offsets
const sortTimezones = (timezones: TimezoneOption[]): TimezoneOption[] => {
  // Precompute all offsets once
  const timezonesWithOffsets = timezones.map((tz) => ({
    ...tz,
    offsetMinutes: getTimezoneOffsetMinutes(tz.value),
  }));

  // Sort using precomputed offsets
  return timezonesWithOffsets
    .sort((a, b) => {
      // Sort by UTC offset first, then by city name
      if (a.offsetMinutes !== b.offsetMinutes) {
        return a.offsetMinutes - b.offsetMinutes;
      }

      // If same offset, sort alphabetically by city
      return a.label.localeCompare(b.label);
    })
    .map(({ offsetMinutes, ...tz }) => tz); // Remove the temporary offsetMinutes property
};

// Get available timezones dynamically
export const getAvailableTimezones = (): TimezoneOption[] => {
  try {
    // Try modern API first
    if (
      'supportedValuesOf' in Intl &&
      typeof Intl.supportedValuesOf === 'function'
    ) {
      const timezones = Intl.supportedValuesOf('timeZone');
      const filteredTimezones = timezones
        .filter((tz) => {
          // Filter out some less common or deprecated timezones
          return (
            !tz.includes('SystemV') &&
            !tz.includes('Etc/GMT') &&
            (tz.includes('/') || tz === 'UTC') &&
            !tz.startsWith('US/') &&
            !tz.startsWith('Canada/')
          );
        })
        .map((timezone) => ({
          value: timezone,
          label: getTimezoneDisplayName(timezone),
          region: getRegionFromTimezone(timezone),
        }));

      return sortTimezones(filteredTimezones);
    }
  } catch (error) {
    console.warn('Failed to get supported timezones:', error);
  }

  // Fallback to common timezones if API not available
  const commonTimezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'America/Vancouver',
    'America/Sao_Paulo',
    'America/Mexico_City',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Paris',
    'Europe/Rome',
    'Europe/Madrid',
    'Europe/Amsterdam',
    'Europe/Stockholm',
    'Europe/Zurich',
    'Europe/Moscow',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'Asia/Singapore',
    'Asia/Seoul',
    'Asia/Mumbai',
    'Asia/Dubai',
    'Asia/Bangkok',
    'Asia/Jakarta',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Pacific/Auckland',
    'UTC',
  ];

  const mappedTimezones = commonTimezones.map((timezone) => ({
    value: timezone,
    label: getTimezoneDisplayName(timezone),
    region: getRegionFromTimezone(timezone),
  }));

  return sortTimezones(mappedTimezones);
};

export type { TimezoneOption };
