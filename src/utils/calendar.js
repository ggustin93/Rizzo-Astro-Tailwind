const CAL_PREFIX = /^https?:\/\/cal\.com\//;

/**
 * A lawyer without a real cal.com URL must not get a booking control at all —
 * a dead or disabled button is worse than no button (issues #9, #12).
 */
export const isValidCalendarLink = (link) => typeof link === 'string' && CAL_PREFIX.test(link);

/** The `data-cal-link` value the cal.com embed expects (path without the origin). */
export const calEmbedTarget = (link) =>
  isValidCalendarLink(link) ? link.replace(CAL_PREFIX, '') : undefined;

/** Lawyers from site-config that can actually be booked. */
export const bookableLawyers = (lawyers = []) =>
  lawyers.filter((lawyer) => isValidCalendarLink(lawyer.calendarLink));
