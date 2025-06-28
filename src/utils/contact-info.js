import { getEntry } from 'astro:content';

// Fallback contact info
const fallbackContactInfo = {
    fr: {
      phone: "+32 488 40 45 49",
      email: "c.rizzo@avocat.be",
      address: "Chaussée de Waterloo 1151, 1180 Bruxelles"
    },
    en: {
      phone: "+32 488 40 45 49",
      email: "c.rizzo@avocat.be",
      address: "Chaussée de Waterloo 1151, 1180 Brussels"
    },
    it: {
      phone: "+32 488 40 45 49",
      email: "c.rizzo@avocat.be",
      address: "Chaussée de Waterloo 1151, 1180 Bruxelles"
    }
  };

// Get contact info from centralized config or fallback to static data
export async function getContactInfo(lang = 'fr') {
  try {
    const siteConfigEntry = await getEntry('config', 'site-config');
    const globalContactInfo = siteConfigEntry?.data?.contactInfo;
    
    if (globalContactInfo) {
      // Use centralized config with appropriate address translation
      const addressTranslations = {
        en: globalContactInfo.address.replace('Bruxelles', 'Brussels'),
        fr: globalContactInfo.address,
        it: globalContactInfo.address
      };
      
      return {
        phone: globalContactInfo.phone,
        email: globalContactInfo.email,
        address: addressTranslations[lang] || addressTranslations.fr
      };
    }
  } catch (error) {
    console.warn('Could not load contact info from config, using fallback');
  }
  
  return fallbackContactInfo[lang] || fallbackContactInfo.fr;
}

// Legacy export for backward compatibility
export const contactInfo = fallbackContactInfo;