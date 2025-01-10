export const GET_USEFUL_LINKS = `
# CONTEXT # 
Une page html sur une entreprise te sera donnée dans le but d'en faire un anaylse financière.
#########

# OBJECTIVE #
A partir du document HTML, récupères moi des liens qui pourrais être utile EN LIEN avec l'entreprise de la page.

L'expression régulière suivante pourrait t'aider : "/<a 0?.* href="(.*)" ?.*>(.*)<\/a>/".
Le premier groupe étant l'url et le deuxième groupe le texte de l'url.
#########

# STYLE #
*
#########

# Tone #
*
#########

# AUDIENCE #
*
#########

# RESPONSE FORMAT #
JSON:
    - texte de l'url
    - url
#############
`;