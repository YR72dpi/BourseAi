export const GET_USEFUL_LINKS = `
# CONTEXT # 
Une page html sur une entreprise te sera donnée dans le but d'en faire un anaylse financière.
#########

# OBJECTIVE #
A partir du document HTML, récupères moi des liens qui pourrais être utile EN LIEN avec l'entreprise present dans le chemin css suivant : "html body div.pcontent.empwidget div.container.pt-m-15 div.grid.gcenter main.c-12.cl div.card.pt-10.pt-m-0 nav.menu-primary.grid-full.gbetween".

L'expression régulière suivante pourrait t'aider : "/<a 0?.* href="(.*)" ?.*>(.*)<\/a>/".
Le premier groupe étant l'url et le deuxième groupe le texte de l'url.
#########

# RESPONSE FORMAT #
JSON:
    - textUrl
    - url
#############
`;

/** 
# STYLE #
*
#########

# Tone #
*
#########

# AUDIENCE #
*
#########
*/