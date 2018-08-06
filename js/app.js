//Get card elements
let allCards = document.getElementsByClassName('card');
let card = [...allCards];
let cardsDeck = document.getElementsByClassName('deck')[0];

//Query DOM Elements
let stars = document.querySelector('.stars');
let allMoves = document.querySelector('.moves');
let modal = document.getElementById('winMessage');

//Define Variables
let matchedCards = document.getElementsByClassName('match');
let shuffledCards;
let displayedCards = [];
let moves = 0;
let timer = document.querySelector('.timer');
let minutes = 0;
let seconds = 0;
let hours = 0;
let time;

//Start game
restart();

//Function that clears the slate for each new game
function restart() {
	displayedCards = [];
	cardsDeck.innerHTML = '';
	moves = 0;
	allMoves.innerHTML = moves;
	stars.innerHTML = '<li><i class="fas fa-star"></i></li><li><i class="fas fa-star"></i></li><li><i class="fas fa-star"></i></li>';
	
	//Reset timer
	seconds = 0;
	minutes = 0;
	hours = 0;
	let timer = document.querySelector('.timer');
	timer.innerHTML = 'Time ->  0 : 0: 0';
	clearInterval(time);
	
	
	//Shuffle cards and create deck
	let fragment = document.createDocumentFragment();
	shuffledCards = shuffle(card);
	shuffledCards.forEach(function(x){
		x.classList.remove('show', 'open', 'match', 'disabled');
		x.addEventListener('click', matchLogic);
		x.addEventListener('click', modalPopup);
		fragment.appendChild(x);
	});
	cardsDeck.appendChild(fragment);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

//Timer function
function Timer(){
	time = setInterval(function(){
		timer.innerHTML = 'Time -> ' + hours + ' : ' + minutes + ' : ' + seconds;
		seconds++;
	
		if (seconds == 60){
			minutes++;
			seconds = 0;
		}
	
		if (minutes == 60){
			hours++;
			minutes = 0;
		}
	}, 1000);
}

//Keeps track of moves and changes rating
function movesCounter(){
	moves = moves + 1;
	allMoves.innerHTML = moves;
	
	if(moves == 1){
		seconds = 0;
		minutes = 0;
		hours = 0;
		Timer();
	}
	else if (moves > 10 && moves < 21) {
		stars.innerHTML = '<i class="fas fa-star"></i><i class="fas fa-star"></i>';
	}
	else if (moves >= 21) {
		stars.innerHTML = '<i class="fas fa-star"></i>';
	}
}

//Main game logic function
function matchLogic(event) {
	this.classList.toggle('open');
	this.classList.toggle('show');
	this.classList.toggle('disabled');
	displayedCards.push(this);
	
	//Check to see if the cards match
	let len = displayedCards.length;
	if(len === 2){
		movesCounter();
		if(displayedCards[0].getElementsByClassName('fas')[0].className === displayedCards[1].getElementsByClassName('fas')[0].className) {
			displayedCards[0].classList.add('match', 'disabled');
			displayedCards[1].classList.add('match', 'disabled');
			displayedCards[0].classList.remove('show', 'open');
			displayedCards[1].classList.remove('show', 'open');
			displayedCards = [];
		}
		else {
			displayedCards[0].classList.add('unmatched');
			displayedCards[1].classList.add('unmatched');
			card.forEach(function (x) {
				x.classList.add('disabled');
			});
			
			setTimeout(function(){
				displayedCards[0].classList.remove('show', 'open', 'unmatched');
				displayedCards[1].classList.remove('show', 'open', 'unmatched');
				card.forEach(function (x) {
					x.classList.remove('disabled');
					for(var i = 0; i < matchedCards.length; i++) {
						matchedCards[i].classList.add('disabled');
					}
				});
				displayedCards = [];
			},1000);
		}
	}
}

//Congratulatory popup
function modalPopup(){
	if (matchedCards.length === 16){
		clearInterval(time);
		document.getElementById('playerRating').innerHTML = stars.innerHTML;
		document.getElementById('playerMoves').innerHTML = moves;
		document.getElementById('playerTime').innerHTML = timer.innerHTML;
		modal.style.display = 'block';
	}
}

//Function to close modal and play game again
function playAgain(){
	modal.style.display = 'none';
	restart();
}