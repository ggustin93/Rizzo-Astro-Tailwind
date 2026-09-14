import { getEntry } from 'astro:content';
import { getContactInfo } from './contact-info.js';

/** Resolve shared public contacts without mutating the content collection. */
export async function resolveLegalContent(content) {
  const contact = await getContactInfo();
  const config = await getEntry('config', 'site-config');
  const phones = config.data.lawyers
    .filter(lawyer => ['christine-rizzo', 'stephanie-michiels'].includes(lawyer.id))
    .map(lawyer => lawyer.phone).join(' - ');
  return {
    ...content,
    sections: content.sections.map(section => ({
      ...section,
      text: section.text
        .replaceAll('%%ADDRESS%%', contact.address)
        .replaceAll('%%EMAIL%%', contact.email)
        .replaceAll('%%PHONES%%', phones)
        .replaceAll('%%PHONE%%', contact.phone),
    })),
  };
}
