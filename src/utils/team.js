import { getEntry } from 'astro:content';
import { DEFAULT_LOCALE } from '../config/locales';

const findByName = (list, name) => list.find((item) => item.name === name);

/**
 * URL of a lawyer's profile page.
 *
 * Uses the slug getTeam() resolved from profile.yml. Deriving it from the name
 * instead (lowercase + replace) drops accents and every space after the first,
 * which silently produces a 404 for the names it was not written for.
 */
export const profilePath = (lang, lawyer) => `/${lang}/equipe/${lawyer.slug}/`;

/**
 * Lawyers for one locale, with their public slug and images resolved.
 *
 * Slugs are declared explicitly in profile.yml (`lawyerSlugs`) rather than
 * derived from the name: transliterating accents in code silently produces
 * the wrong URL for names it was not written for (issue #8).
 */
export async function getTeam(lang) {
  const entry = await getEntry('profile', 'profile');
  if (!entry) {
    throw new Error('Profile entry not found! Make sure you have a `profile.yml` file in `src/content/profile`.');
  }

  const localized = entry.data[lang] || entry.data[DEFAULT_LOCALE];
  if (!localized) {
    throw new Error(`Content not found for language: ${lang}`);
  }

  const lawyers = localized.lawyers || [];
  if (lawyers.length === 0) {
    throw new Error(`No lawyers found in profile data for language: ${lang}`);
  }

  const slugs = entry.data.lawyerSlugs || [];
  const teamImages = entry.data.teamImages || [];
  const profileImages = entry.data.profileImages || [];

  return lawyers.map((lawyer) => {
    const slugEntry = findByName(slugs, lawyer.name);
    if (!slugEntry?.slug) {
      throw new Error(
        `No slug configured for "${lawyer.name}". Add an entry to \`lawyerSlugs\` in src/content/profile/profile.yml.`
      );
    }

    const teamImage = findByName(teamImages, lawyer.name)?.image;
    const profileImage = findByName(profileImages, lawyer.name)?.image;

    return {
      ...lawyer,
      slug: slugEntry.slug,
      // Square portrait for the listing, tall portrait for the profile page.
      image: teamImage ?? lawyer.image,
      profileImage: profileImage ?? teamImage ?? lawyer.image,
    };
  });
}
