# Convertisseur Markdown → JSON | Cours Dev/Web Avancé

Le projet consiste à prendre un fichier Markdown en entrée, et à le convertir en JSON afin de l'afficher dans la console.

## Prérequis

N.B. : le script marche chez les développeurs, donc fonctionne forcément à tous les coups
- NodeJS version 10+
- NPM version 7+
- Séquence de fin de ligne du fichier Markdown en LF
- Si le programme ne marche pas, relire la ligne 1

## Utilisation

`npm install` pour installer les dépendances.  
`npm start` ou `npm run dev` pour lancer le script.

Sortie attendue :
```JSON
{
    "h1": {
        "label": "Titre du document",
        "content": {
            "h2": {
                "label": "Titre de niveau 2",
                "content": {
                    "h3": {
                        "label": "Un titre de niv 3",
                        "content": {
                            "ul": [
                                {
                                    "li": "une liste"
                                },
                                {
                                    "li": "à"
                                },
                                {
                                    "li": "puce"
                                }
                            ]
                        }
                    },
                    "code": "\n# Un bloc de code en shell\necho \"coucou les lapinous\"\n",
                    "p": "Un nouveau paragraphe\nToujours le même paragraphe"
                }
            },
            "p": "Voici un paragraphe"
        }
    }
}
```

## Fonctionnement

### 1 - Récupération du fichier

Le ficher markdown est récupéré et les tabulations retirées pour faciliter le traitement.

### 2 - Identification et parsing

Chaque ligne du fichier Markdown est lue et identifiée comme étant un "bloc" spécifique, tel qu'un titre ou un paragraphe (fonction récursive `identify`). Elle sont ensuite converties en objet et stockés dans un tableau.

### 3 - Création du JSON

Le tableau d'objet créé précédemment est déroulé dans l'ordre inverse (fonction récursive `saveToJson`) : pour chaque objet (le "child"), l'algorithme essaie de lui trouver un "parent" dans lequel le stocker. Au fur et à mesure, l'objet grandit et devient le JSON final. Oui, l'enfant grandit et devient grand, le développement c'est aussi de la poésie parfois...
Le JSON est ensuite affiché dans la console.