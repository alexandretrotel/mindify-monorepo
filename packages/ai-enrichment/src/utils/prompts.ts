export const getAuthorPrompt = (authorName: string): string => {
  const prompt = `Résume en français de manière concise la biographie de ${authorName} sans faire allusion à un livre ou une ressource.`;

  return prompt;
};

export const getSummaryPrompt = (title: string, authorName: string): string => {
  const prompt = `Résume ${title} de ${authorName} en 5 à 8 chapitres en français. Mets toi dans la peau d'un rédacteur qui doit résumer le livre pour un public qui n'a pas lu le livre. Un chapitre doit faire environ 200-300 mots. La longueur totale du texte doit avoisiner les 2000 mots (+/- 200 mots). Fournis également une estimation du temps de lecture global. Ne mets pas de liens externes dans le texte ni de caractères spéciaux. Ton objectif est de simplifier et rendre dynamique les idées principales de "${title}", pour une lecture immersive et accessible à tous. Les chapitres doivent être structurés de manière logique et suivre le fil conducteur du livre. Chaque chapitre doit être unique et apporter une valeur ajoutée à la compréhension globale du livre sans se répéter. Les chapitres doivent être écrits dans un style fluide et engageant, sans jargon technique ni termes complexes. Enfin, ne mentionne pas le mot "chapitre", ni le nom de l'auteur ou de l'oeuvre dans ton texte mais concentre toi sur les idées et les concepts clés.`;

  return prompt;
};

export const getMindsPrompt = (title: string, authorName: string): string => {
  const prompt = `Imagine que tu es un écrivain passionné par les idées qui façonnent notre vision du monde. Ton objectif est de capturer l’essence d'un livre, en extrayant les concepts clés et les idées majeures, tout en restant fidèle à l’esprit de l’auteur. Écris entre 2 et 3 "minds" en français, qui sont des idées concises tirées du livre ${title} de ${authorName}. Chaque mind doit être rédigé du point de vue de l’auteur, comme s’il s’agissait de ses propres pensées. Ne reformate pas les textes comme des citations et ne mentionne pas le nom de l’auteur ou du livre. Exemple de mind : "La vie n’est pas une série de problèmes à résoudre, mais une aventure à vivre pleinement."
      `;

  return prompt;
};
