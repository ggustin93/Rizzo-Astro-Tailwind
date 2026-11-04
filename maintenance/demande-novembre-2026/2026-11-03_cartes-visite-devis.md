# Mail à Christine et Stephanie : devis cartes de visite

À : christine@rizzoavocate.be, cc stephanie@michielsavocate.be. Objet : « Cartes de visite ». Envoyé par Guillaume (page mail-link).

Bonjour Christine, bonjour Stephanie,

Merci pour votre message, je m'occupe volontiers de vos cartes de visite.

J'ai regardé le projet transmis par Romain. Comme les fichiers exportés depuis Canva ne permettent pas de changer la police, je vais le reconstruire en Synonym, avec la même mise en page et les mêmes textes, dans des fichiers prêts pour l'imprimeur.

Pour la préparation des 4 cartes, je compte environ 3h30, soit 260 € HT. Pour l'impression, je compare deux ou trois imprimeurs en ligne et je commande chez le meilleur : 100 cartes recto verso par personne sur un papier mat de 400 g, livrées au cabinet. J'estime l'impression à environ 100 € HT pour les quatre, soit **environ 360 € HT au total**.

Si vous préférez un papier plus épais (600 g), il faut compter environ 550 € HT au total ; je vous confirmerai le prix exact avant de commander. Et pour info, 100 cartes ne coûtent que 1,50 € HT de plus que 50.

Je peux commencer vendredi. Je vous enverrai alors deux propositions en PDF : une version fidèle au projet, aux couleurs du site, et une variante un peu plus épurée. Vous me faites part de vos remarques (un tour de corrections est compris), et je ne passe commande qu'après votre accord.

Si cela vous convient, une petite confirmation suffit pour que je me lance.

Bien à vous,

Guillaume

---

## Notes internes
- Demande reçue par e-mail le 03/11 (Christine & Stephanie). Fiche Notion RM-28 (À examiner, Hors forfait, 3 h). Spec #43, tickets #44 (devis) → #45 (carte de Christine, premier essai) → #46 (3 autres cartes) → #47 (épreuve, commande, facture).
- Pièces : projet Canva de Clémentine Lurdos, transmis par Romain (PDF de 8 pages 85 × 55 mm, Poppins, déjà en CMJN, sans fond perdu ; 8 SVG aux textes vectorisés). Les noms de Romain et d'Arnaud sont à environ 2 mm du bord. Le « f » de « fonction » est bien présent (faux positif de l'extraction).
- Police : Synonym officielle sur Fontshare (ITF Free Font License, impression commerciale OK). La webfont du repo vient d'OnlineWebFonts (licence floue) : à remplacer éventuellement, dans une autre demande.
- Couleurs du site proposées sur l'épreuve : #263952, #068D9D, #FFCC33, #53599A (au lieu de #1a3060, #3a8cbc, #ecb82a, #4262b4 dans Canva).
- Prix relevés le 03/11 : Printdeal à partir de 13,99 € HTVA les 500 cartes ; MOO Luxe à 42 € les 50 et 74 € les 100 ; OvernightPrints premium à partir de 19,46 € TTC les 100. CarteVisite.be écarté (livraison en France seulement). Graphistes belges : 130 à 350 € pour une carte. Guillaume : 85 € HT/h.
- Impression refacturée au prix coûtant, sans marge. Option légère à 75 € HT si l'auteure du projet change elle-même la police dans Canva.
- 04/11 : mail revu après l'avis de trois experts (graphiste print, relation client, pricing freelance). Ils sont d'accord pour annoncer le travail, mais en écrivant « reconstruire à l'identique » plutôt que « refaire ». « Refaire » vexerait l'auteure, ouvrirait la porte à une refonte et ferait paraître 240 € cher pour « juste une police ». Ajouts : référence Studio Infanti, petits écarts annoncés sur l'épreuve, un seul tour de corrections avec les remarques groupées, accord écrit avant la commande, couleurs imprimées qui varient de l'écran. Écartés : « basse définition » (faux, le monogramme est à environ 560 ppp), « Synonym plus large » (non mesuré), le nom de Clémentine (le cabinet ne la nomme pas).
- Méthode prévue : un gabarit HTML/CSS alimenté par site-config, export PDF avec Playwright, puis conversion CMJN avec Ghostscript. Les SVG ne sont pas éditables (texte vectorisé, logo et icônes en images).
- Point ouvert : l'imprimeur utilisé pour Studio Infanti. S'il a donné satisfaction, il devient la recommandation principale.
- 04/11 : tarification. Forfait de 260 € HT pour la préparation (calcul interne : environ 3,5 h à 75 € HT/h ; 75 € parce que ce n'est pas le cœur de métier). Le taux horaire n'est volontairement pas écrit dans le mail : la grille interne d'avril (forfait maintenance) retenait 85 € HT/h hors forfait ; on ne sait pas si ce taux a été communiqué à Christine (à vérifier dans les mails envoyés). Option légère à 75 € HT (environ 1 h). Personne supplémentaire : 40 € HT. Impression : une seule commande pour les 4, avec des échantillons de papier si elles hésitent (pas de commande test pour Christine seule : deux frais de port, plus de délai, et un risque d'écart de teinte entre lots).
- 04/11 : relecture anti-IA (liaisons « d'ailleurs », « donc » retirées, répétitions de « à l'identique » et des marges allégées, « vectoriel » expliqué). Phrase sur Canva rendue exacte : seuls les SVG ont le texte vectorisé, le PDF incorpore Poppins, mais un export Canva ne permet de toute façon pas de changer la police. Le conseil des 100 cartes et l'offre d'échantillons sont intégrés aux deux questions.
- 04/11 : prix tout compris. Guillaume achète l'impression et l'inclut dans le devis : 360 € HT (260 € de préparation + environ 100 € d'impression pour 4 × 100 cartes mat épais), 560 € HT avec papier luxueux (environ 300 € chez MOO Luxe), 175 € HT pour l'option légère (75 € + impression). Prix relevés le 04/11 pour 100 cartes recto verso, livraison gratuite en Belgique : Printoclock 350 g dès 16 € HT, Printdeal 300 g 21,50 € HT, Helloprint 340 g 16,79 € HT. Une commande par carte (4 fichiers différents). L'arrondi absorbe les écarts de configuration, sans marge cachée. Début des travaux annoncé pour samedi 07/11.
- 04/11 : passe humanizer. « légèrement » n'apparaît plus deux fois ; l'avertissement sur les couleurs imprimées rejoint la phrase sur l'épreuve ; le gras de la section Prix ne porte plus que sur les montants ; « version plus luxueuse » devient « version plus épaisse », un mot plus concret.
- 04/11 : option haut de gamme revérifiée chez MOO Luxe : 600 g, 74 € les 100, recto verso inclus, un design différent possible par carte dans un même paquet. TVA comprise ou non : non indiqué. Livraison vers la Belgique : à calculer. Format de coupe : 84 × 55 mm (et non 85 × 55), donc fichiers à adapter si cette option est retenue. Le « 560 € HT » ferme devient « environ 550 € HT, prix exact confirmé avant commande ».
- 04/11 : version finale, plus professionnelle, après l'avis de trois experts UX (rédaction claire, architecture de décision, lecture sur mobile). Studio Infanti et le détail technique sont retirés. L'estimation est précisée (260 € HT, environ 3h30 ; impression 100 € HT pour un tarif réel de 86 € HT). Une seule confirmation suffit. Début vendredi 06/11, avec deux épreuves : version fidèle aux couleurs du site et variante épurée (prototype /impeccable). L'option légère (Canva) n'est plus proposée, gardée en réserve à 75 € HT + impression.
- Simulation Printdeal (navigateur Orca, 04/11) : 85 × 55, papier couché mat 400 g, recto verso 4/4, coins droits, livraison normale gratuite. 25 ex. : 19,20 € ; 50 ex. : 20,00 € ; 100 ex. : 21,50 € ; 250 ex. : 26,75 € HT. Vistaprint : 250 cartes standard à 15,99 € TTC (promo), minimum 100. MOO Luxe : 74 € les 100, 600 g, format de coupe 84 × 55, TVA non précisée.
- Prototypes : scratchpad `cartes/proto/` (christine-origine, christine-site, christine-impeccable ; HTML/CSS, export PDF avec Chromium, webfont Synonym Regular du repo, à remplacer par l'OTF Fontshare).
- 04/11 : passe humanizer sur la version finale. Les étiquettes en gras de l'estimation deviennent des phrases ; seul le total reste en gras. Le détail des 3h30, qui répétait le déroulement, est retiré. L'écart 50/100 cartes est rapproché de l'impression. « simple » et « à titre indicatif » sont supprimés.
- 04/11 : version plus naturelle, à la demande de Guillaume. Prose sans intertitres ni liste numérotée, seul le total en gras, objet « Cartes de visite ». Contenu inchangé.
- 04/11 : l'imprimeur n'est plus nommé, puisque Guillaume commande lui-même. Le mail dit qu'il compare deux ou trois imprimeurs (Printdeal 86 € HT, Vistaprint, Helloprint ou Printoclock). MOO n'est plus nommé pour l'option 600 g. Le nom de l'imprimeur retenu sera donné à la commande ou sur demande.
- 04/11 : l'impression est présentée comme une estimation (« environ 100 € HT », total « environ 360 € HT »), sans détail des tarifs relevés. Tarif réel relevé : 86 € HT chez Printdeal.
