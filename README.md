## API

### Créer un sondage

`POST /polls`

Paramètres : 
- question: string
- answers: string[]

Réponse : `201 Created`
Sondage nouvellement créé en JSON :
```
{"id":1, "question": "Question ?", "answers":
["Réponse 1", "Réponse 2"], "votes": []}
```

Erreurs :
- `400 Bad Request`: Paramètres incorrects

### Lister les sondages

`GET /polls`

Réponse : `200 OK`
Liste des sondages (id et question) en JSON
```
[{"id":1, "question": "Question ?"}, ...]
```

### Récupérer un sondage et ses résultats 

`GET /polls/:id`

Réponse : `200 OK`
Sondage en JSON :
```
{"id":1, "question": "Question ?", "answers":
["Réponse 1", "Réponse 2"], "votes": [0, 0, 1, 0, 1]}
```

Erreurs : 
- `404 Not Found`: Sondage non-trouvé

### Voter pour une réponse d'un sondage

`POST /polls/:id/votes`

Paramètres : 
- answer: Index de la réponse (number)

Réponse : `201 Created`

Erreurs :
- `400 Bad Request`: Paramètres incorrects
- `404 Not Found`: Sondage non-trouvé