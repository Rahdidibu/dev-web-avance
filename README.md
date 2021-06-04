# Convertisseur Markdown → JSON | Cours Dev/Web Avancé

Le projet consiste à prendre un fichier Markdown en entrée, et à le convertir en JSON afin de l'afficher dans la console.

## Prérequis

- NodeJS version 10+
- NPM version 7+

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

TODO parce que flemme là il est 1h du mat' donc bon