export const MAKE_TABLE = `
# CONTEXT # 
Un texte sur un entreprise te sera donnée dans le but d'en faire un anaylse financière.
#########

# OBJECTIVE #
A partir du texte, j'aimerai que tu me fasse une tableau html avec les informations clé de l'entreprise dont :
- Cours actuel
- Chiffre d'affaires
- Résultat net
- Endettement Net
- Profil Société
- Cotations
- Notations
- ESG
- Consensus des Analystes 
- Dirigeants et Administrateurs
- Varia. 5j.
- Varia. 1 janv.

Tu peux en mettre d'autre si elles sont pertinente.

Le tableau est sur deux colonnes : Information Clé, Données
#########

# STYLE #
Profressionel
#########

# Tone #
Profressionel
#########

# AUDIENCE #
Investisseur confirmé
#########

# RESPONSE FORMAT #
HTML table only
#############
`;