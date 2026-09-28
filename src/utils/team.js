import { getEntry } from 'astro:content';

export function profilePath(lang, member) {
  return `/${lang}/equipe/${member.slug}/`;
}

/** A CMS text field may hold several paragraphs: each line break starts a new one. */
function paragraphs(items) {
  return items.flatMap(item => item.split(/\s*\n\s*/)).filter(Boolean);
}

/** Shared identity and order, localized editorial content, independent contacts. */
export async function getTeam(lang) {
  const [profiles, config] = await Promise.all([
    getEntry('profile', 'profile'),
    getEntry('config', 'site-config'),
  ]);
  const localized = profiles?.data[lang]?.lawyers;
  const members = config?.data.team;
  if (!localized || !members) {
    throw new Error(`Missing team content for ${lang}`);
  }
  const profileIds = new Set(localized.map(item => item.id));
  if (localized.length !== members.length || profileIds.size !== members.length) {
    throw new Error(`Each team member needs exactly one ${lang} profile`);
  }

  return members.map(member => {
    const content = localized.find(item => item.id === member.id);
    if (!content) {
      throw new Error(`Missing ${lang} profile: ${member.id}`);
    }
    const contact = config.data.lawyers.find(item => item.id === member.id);
    return {
      ...content,
      ...member,
      presentation: paragraphs(content.presentation),
      bio: paragraphs(content.bio),
      profileImage: member.profileImage || member.image,
      contact,
    };
  });
}
