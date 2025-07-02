import { getEntry } from 'astro:content';

export async function getContactInfo() {
  const siteConfigEntry = await getEntry('config', 'site-config');
  const globalContactInfo = siteConfigEntry?.data?.contactInfo;

  if (!globalContactInfo) {
    throw new Error("FATAL: Global contact info could not be loaded from site-config.yml in getContactInfo utility.");
  }

  // L'objet retourné est maintenant directement basé sur la configuration globale.
  // La logique de traduction spécifique à l'adresse est gérée ici.
  return {
    phone: globalContactInfo.phone,
    whatsapp: globalContactInfo.whatsapp,
    email: globalContactInfo.email,
    linkedin: globalContactInfo.linkedin,
    address: globalContactInfo.address // L'adresse de base est en français
  };
}