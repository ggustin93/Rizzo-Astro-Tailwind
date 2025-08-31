import { getEntry } from 'astro:content';

export async function getContactInfo() {
  const siteConfigEntry = await getEntry('config', 'site-config');
  const lawyers = siteConfigEntry?.data?.lawyers || [];
  const address = siteConfigEntry?.data?.address;

  if (!lawyers || lawyers.length === 0) {
    throw new Error("FATAL: No lawyers found in site-config.yml in getContactInfo utility.");
  }

  // Use the primary lawyer (Christine Rizzo) for contact info utility
  const primaryLawyer = lawyers.find((lawyer) => lawyer.name === "Christine Rizzo") || lawyers[0];

  // L'objet retourné est maintenant directement basé sur la configuration globale.
  // La logique de traduction spécifique à l'adresse est gérée ici.
  return {
    phone: primaryLawyer.phone,
    whatsapp: primaryLawyer.whatsapp,
    email: primaryLawyer.email,
    linkedin: primaryLawyer.linkedin,
    address: address // L'adresse de base est en français
  };
}