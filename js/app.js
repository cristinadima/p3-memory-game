// Game variables
var open = [];
var matched = 0;
var movesCounter = 0;
var numStars = 3;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

// max number of moves for each star
var hard = 20;
var medium = 25;

var modal = $("#win-modal");

/*
 * Create a list that holds all of your cards
 */

var deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Randomizes cards on board and updates card HTML
function updateCards() {
    deck = shuffle(deck);
    var index = 0;
    $.each($(".card i"), function(){
      	$(this).attr("class", "fa " + deck[index]);
      	index++;
    });
    resetTimer();
};


// Updates modal HTML
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numStars--;
    $(".num-stars").text(String(numStars));
};


function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numStars = 3;
    $(".num-stars").text(String(numStars));
};

// Interval function increments timer 
var startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }


// Ensure that single digit seconds are preceded with a 0
 var formattedSec = "0";
 if (timer.seconds < 10) {
    formattedSec += timer.seconds
  } else {
    formattedSec = String(timer.seconds);
  }

    var time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
};


// Resets timer state and restarts timer
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(startTimer, 1000);
};


// Updates number of moves in the HTML
function updateMoveCounter() {
    $(".moves").text(movesCounter);

    if (movesCounter === hard || movesCounter === medium) {
        removeStar();
    }
};


// Checks if card is not currently matched or open
function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};


//  Checks if open cards match
function checkMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};


// Win condition
function hasWon() {
    if (matched === 16) {
        return true;
    } else {
        return false;
    }
};


// Sets currently open cards to the match state, checks win condition
var setMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    matched += 2;

    if (hasWon()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};


// Sets currently open cards back to default state
var resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};


// Sets selected card to the open and shown state
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};



// Resets all game state variables to default state
var resetGame = function() {
    open = [];
    matched = 0;
    movesCounter = 0;
    resetTimer();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};


// Handles primary game logic of game
var onClick = function() {
    if (isValid( $(this) )) {

        if (open.length === 0) {
            openCard( $(this) );

        } else if (open.length === 1) {
            openCard( $(this) );
            movesCounter++;
            updateMoveCounter();

            if (checkMatch()) {
                setTimeout(setMatch, 300);

            } else {
                setTimeout(resetOpen, 700);

            }
        }
    }
};


$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(resetGame);


// Provides a randomized game board on page load
$(updateCards);