# WhatsApp à Christine : statut RM-22 à RM-27

Hello Christine 🙂

Tes demandes récentes sont traitées et en ligne sur le site : https://rizzo-michiels.be/fr/equipe/

Ce qui a été fait :
• Équipe : les nouvelles photos d'Arnaud, de Romain et la tienne sont en place ✅
• Le nom de Romain s'affiche désormais partout en « Romain Archalaüs Hautecourt » ✅ (c'est bien ce que tu souhaitais ?)
• Fonctionnaires européens : la liste compte maintenant les 5 mêmes services dans les 4 langues ✅ Stephanie aurait-elle deux minutes pour relire la page NL ?
• En italien, le lien du bas de page s'appelle « Politica sulla privacy » ✅
• Le CMS permettait déjà de changer les photos, mais c'est maintenant plus clair : tout ce qui concerne l'équipe est réuni dans « Page Équipe », avec « Membres » pour les noms, photos et coordonnées, et « Textes de la page et des profils » pour ce qui se traduit.
• Les photos que tu ajoutes dans le CMS sont désormais allégées automatiquement, pour que le site reste léger et garde sa bonne note EcoIndex : une photo de 2 Mo prise au téléphone s'affiche à environ 80 Ko, sans perte visible. Sous chaque photo, une petite aide indique le format conseillé.

Merci pour tes retours, belle soirée !
Guillaume

---

## Notes internes

- À : Christine Rizzo. Canal : WhatsApp. Tutoiement, comme le mail du 03/10 (le WhatsApp du 29/09 vouvoyait, à harmoniser si Guillaume préfère).
- Demandes Notion : RM-22 (lien IT), RM-23 (CMS Équipe), RM-24 (photos), RM-25 (services UE), RM-26 (nom de Romain), RM-27 (photos allégées, #42). Toutes en « À valider ». « Réponse de Guillaume » pas encore écrite dans Notion : en attente d'accord.
- En réserve si question :
  - Allègement : Netlify Image CDN (WebP/AVIF, redimensionnement), actif seulement sur Netlify ; version haute définition seulement si la photo d'origine est assez grande.
  - Plafond de 5 Mo par champ photo du CMS ; pas de plafond dans l'onglet Médias ni dans le texte riche (limite de Decap).
  - Coût : plan Netlify gratuit à crédits, pas de compteur séparé pour les transformations.
  - 3.png = Romain par déduction (Arnaud et Christine nommés), question retirée.
  - RM-25 : écart créé par des modifications CMS langue par langue des 30-31/03 (compte Christine) ; NL traduit du FR le 29/08. Garde-fous ajoutés (test + rappel CMS, 64b71cba). Ne pas évoquer la cause sauf question.
- Boîte info@ : accès Outlook déjà réglé et validé avec Christine, hors de ce message.
- Pas encore fait, non mentionné : #41 (logos, illustration 404, favicons modifiables).
- Temps et facturation : non mentionnés, dans la mise à jour d'octobre. À confirmer par Guillaume.
- Staging : commit 49c46eac. Production inchangée (45637deb).
- Parcours photo du CMS testé de bout en bout en local (scripts/verify-cms-photo.mjs, 626b7074) : refus > 5 Mo, upload 4,7 Mo, seul le champ change, photo servie via l'Image CDN. Non testé : connexion au CMS du staging en ligne.
- 14/10 : message adapté après la mise en production (`release: 2026-10-14`, `7ad14f2e`) : lien vers le site en ligne, phrase « le site en ligne ne change pas » retirée. RM-18 à RM-27 en « Terminé » dans Notion, issues #37–#40 et #42 fermées.
