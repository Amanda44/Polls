const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function (req, res){
	res.send('Hello world !')
})

const polls = [
	{
		id: 1,
		question: "Question 1?",
		answers: ["Réponse 1", "Réponse 2", "Réponse 3"],
		votes: [0, 1, 2, 0, 1, 2, 2]
		},

		{
		id: 2,
		question: "Question 2?",
		answers: ["Réponse 1", "Réponse 2", "Réponse 3"],
		votes: [0, 1, 0, 1, 1, 2]
		},

		{
		id: 3,
		question: "Question 3?",
		answers: ["Réponse 1", "Réponse 2", "Réponse 3"],
		votes: [1, 1, 0, 0, 1, 2, 2]
	}
]

//route vers la liste des sondages
app.get('/polls', function(req, res){
	res.send(polls)
})

//route vers un sondage et ses résultats
app.get('/polls/:id', function(req, res){
	//récupération de l'id passé en url
	const id = parseInt(req.params.id)
	//récupération de l'id du tableau correspondant à l'id passé en url
	const poll = polls.find(p => p.id === id)
	console.log(poll)
	//si find ne trouve rien on renvoie une erreur 404
	if(typeof(poll) === 'undefined'){
		//res.status(404).end() équivalent avec rien dans le body
		res.sendStatus(404);
	}
	else{
		res.send(poll)
	}

})

//route de création de sondage 
app.post('/polls', function (req, res) {
	const { question, answers } = req.body;
	/*  	
	2 équivalents pour calculer l'id max
	n°1: Math.max.apply(null, polls.map(p => p.id)) +1
	n°2: let max = 0;
	for (let i = 0; i<polls.length; i++){
		  	if (polls[i].id > max){
		  		max = polls[i].id;
		  	}
	}
	id = max + 1
	*/
	const id = polls.reduce((max, p) => max > p.id ? max : p.id, 0)+1


	//on vérifie que la question est de type string
	if(typeof(question) !== 'string'){
		return res.sendStatus(400)
	}
	//on vérifie que answers est un tableau de strings
	function isString(a){
		return typeof(a) === 'string';
	}
	if(Array.isArray(answers) === false || answers.every(isString) === false)
	{
		return res.sendStatus(400)	
	}
	//on créé un nouveau sondage
	let newPoll = {
		id, question, answers,
		votes: []
	}
	//on ajoute le sondage au tableau polls
	polls.push(newPoll)
	//on retourne le nouvel objet 
	res.send(newPoll)
  	
})

//route de vote pour la réponse d'un sondage
app.post('/polls/:id/votes', function(req, res){
    // On récupère le sondage par son id
	const id = parseInt(req.params.id)
	const poll = polls.find(p => p.id === id)
	const answer = parseInt(req.body.answer)
    // On envoie une erreur si le sondage n'existe pas
	if (typeof(poll) === 'undefined'){
		return res.sendStatus(404);
	}
	if(!(answer in poll.answers)){
		return res.sendStatus(400);
	}
	else{
	    // On récupère l'index de la réponse votée depuis le body
	    // et on vérifie sa validité
	    for(let i = 0 ; i <= poll.answers.length ; i++){
	    	if (i === answer){
	    // On ajoute l'index de la réponse à la liste des votes du sondage
	    		poll.votes.push(answer);
	    	}
	    }
	    // On renvoie la nouvelle liste des votes
	    res.status(201).send(poll.votes);
	}
	
})

app.delete('/polls/:id/delete', function(req, res){
	// On récupère le sondage par son id
	const id = parseInt(req.params.id)
	const index = polls.findIndex(p => p.id === id)
	polls.splice(index, 1)
	res.send(polls)
})

app.listen(3000, () =>{
	console.log('Listening on port 3000')
})