// todo: refaire

export const GET_USEFUL_LINKS = `
# CONTEXT # 
Une page html sur une entreprise te sera donnée dans le but d'en faire un anaylse financière.
#########

# OBJECTIVE #
A partir du document HTML, récupères moi des url de balise des liens suivants : 
    - Cotations
    - Analyse Technique
    - Graphique Statique
    - Graphique Total Return
    - Graphique Actualités
    - Graphique Sectoriel
    - Graphique Comparatif
    - Graphique Force Relative 
    - Toute l'actualité
    - Reco analystes
    - Faits marquants
    - Insiders
    - Transcripts
    - Communiqués
    - Publications officielles
    - Autres langues
    - Idées de trading
    - Articles Zonebourse
    - Analyses Zonebourse 
    - Profil
    - Gouvernance
    - Actionnariat
    - Connexions 
    - Compte de Résultat
    - Bilan
    - Flux de Trésorerie
    - Ratios Financiers
    - Segments d'Activités 
    - Ratios de Valorisation
    - Dividende 
    - Performances sectorielles
    - Dividendes sectoriels
    - Comparaisons Financières 
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