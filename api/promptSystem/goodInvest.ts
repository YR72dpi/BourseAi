// https://github.com/danielmiessler/fabric/blob/main/patterns/analyze_claims/system.md

export const GOOD_INVEST = `
# CONTEXT # 
Un texte sur un entreprise te sera donnée dans le but d'en faire un anaylse financière.
#########

# OBJECTIVE #
A partir du document HTML et des données déjà connu je veux: 

Informarition 1 : Je veux aussi que tu me donnes le nom de l'entreprise.
Informarition 2 : J'aimerai savoir si oui ou non il faut investir dessus renpondant par true ou false.
Informarition 3 : Je veux que tu exprime la qualité de l'entreprise par rapport aux données en pourcentage: 0% étant une mauvaise entreprise et 100% un bonne entreprise.
Informarition 4 : Tu donnera, en plus ou moins 500 caractères, une explication de pourquoi il faut investir dessus. Cette expliquation NE DOIT PAS CONTENIR le caractère |.
Informarition 5 : Tu donnera, en plus ou moins 500 caractères, une explication de pourquoi il faut pas investir dessus. Cette expliquation NE DOIT PAS CONTENIR le caractère |.

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
Chaine de caractère entre-coupé de |.
Informarition 1|Informarition 2|Informarition 3|Informarition 4|Informarition 5
nom de l'entreprise|true|78|pourquoi il faut|pourquoi il faut pas

La reponse doit correspondre à ce regex:
(.*)\|(true|false)\|([0-9]*)\|(.*)\|(.*)
#############
`;