export const GOOD_INVEST = `
# CONTEXT # 
Un texte sur un entreprise te sera donnée dans le but d'en faire un anaylse financière.
#########

# OBJECTIVE #
A partir du document HTML et des données déjà connu, j'aimerai savoir si oui ou non il faut investir dessus renpondant par true ou false.

Exprimes le degré d'intérêt en pourcent, 100% voulant dire qu'il faut vraiment investir sur cette boite.
Un pourcentage >= 70% est un bon investissement. Mais l'entreprise a de trop mauvaises données, il faut mettre le pourcentage en dessous.

Tu donnera aussi une explication de pourquoi il faut investir ou pas dessus. Cette expliquation NE DOIT PAS CONTENIR le caractère |.
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
La reponse doit correspondre à ce regex :
(true|false)\|([0-9]*)\|(.*)
#############
`;