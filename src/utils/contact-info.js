export const contactInfo = {
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
  
  export function getContactInfo(lang) {
    return contactInfo[lang] || contactInfo.fr;
  }