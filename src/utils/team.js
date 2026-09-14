import { getEntry } from 'astro:content';

export const profilePath = (lang, member) => `/${lang}/equipe/${member.slug}/`;

/** Shared identity and order, localized editorial content, independent contacts. */
export async function getTeam(lang) {
  const [profiles, config] = await Promise.all([
    getEntry('profile', 'profile'), getEntry('config', 'site-config'),
  ]);
  const localized = profiles?.data[lang]?.lawyers;
  const members = config?.data.team;
  if (!localized || !members) throw new Error(`Missing team content for ${lang}`);
  if (localized.length !== members.length || new Set(localized.map(item => item.id)).size !== members.length)
    throw new Error(`Each team member needs exactly one ${lang} profile`);
  return members.map(member => {
    const content = localized.find(item => item.id === member.id);
    if (!content) throw new Error(`Missing ${lang} profile: ${member.id}`);
    const contact = config.data.lawyers.find(item => item.id === member.id);
    return {
      ...content, ...member,
      profileImage: member.profileImage || member.image,
      contact,
    };
  });
}
