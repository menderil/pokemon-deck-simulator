//event listeners for buttons
document.querySelector('#searchForCard').addEventListener('click', searchForCard);
document.querySelector('#showDeck').addEventListener('click', displayDeckList);

//variables for uls in the html
const buildSearchResult = document.querySelector('#searchResult');
const displayDeckUl = document.querySelector('#displayDeckList');

//variables for the deck
const totalCards = document.querySelector('#totalCards');
let numberOfCards = 0;
const currentDeck = [];

//the array result from the current search
let currentSearch = [];

/*
    this function searches for cards using the term entered by the user.
    it clears the results of the previous search from the buildSearchResult ul.
    then it takes the value from the input element, converts it into a usable format and sends it to the api.
    the response data is saved in the searchResponse variable.
    it loops throught searchResponse, creating an li with card's image url and id and appends the li to the buildSearchResult ul in the html
*/ 
function searchForCard(){
    let buildSearchInput = document.querySelector('#searchCardText').value;
    
    buildSearchInput = `"${buildSearchInput}"`;
    console.log(buildSearchInput);

    clearUL(buildSearchResult);

    fetch(`https://api.pokemontcg.io/v2/cards?q=name:${buildSearchInput}`)
        .then(response => response.json())
        .then(searchResponse => {
            currentSearch = searchResponse.data;
            //testing log
            //console.log(currentSearch)
            
            for(let i = 0; i < searchResponse.data.length; i++){
                buildSearchResult.appendChild(createCardElements(currentSearch[i], i));
            }
        });
}

/*
    function runs when the card id under a search result is clicked.
    it checks that there's room in the deck for a new card to be added, then confirms the user wants to add the card.
    if they select yes, it checks if the card exists.
    if it does, and less than the maximum of 4 are in the deck, it adds 1 to the card quantity and total number of cards.
    if it doesn't exist, it creates a new Card object, adds it to the deck array and adds 1 to the total number of cards.
*/
function addCardToDeck(){
    if(numberOfCards == 60){
        alert('The deck is full!');
    }else{
        if(confirm(`Add ${this.innerText} to the deck?`)){
            const cardToAdd = currentSearch[this.id]
            const i = currentDeck.findIndex(e => e.id === cardToAdd.id);
            if (i > -1 ) {
                currentDeck[i].addCard();
                numberOfCards++;
            }else{
                currentDeck.push(new Card(cardToAdd.name, cardToAdd.images.small, cardToAdd.id));
                numberOfCards++;
            }
        }
    }
}
/*
    This function displays the current list of cards in the deck
    It clears the previous list, if there is one
    then loops through the deck array, creates an li with the name, id, and quantity of each card
    then appends the li to the display ul
*/
function displayDeckList(){
    clearUL(displayDeckUl);
    //loop through current deck list
    for(let i = 0; i < currentDeck.length; i++){
        //create the elements to add
        const li = document.createElement('li');
        const span = document.createElement('span');

        //show card name, id, and quantity in deck
        span.innerText = `Card: ${currentDeck[i].name} ${currentDeck[i].id} x${currentDeck[i].quantity}`;
        li.append(span);
        displayDeckUl.append(li);
    }
    totalCards.innerText = `Total Cards: ${numberOfCards}`;
}

/*
this function creates and returns an li element with the card's image and id
adds an event listener to the id, allowing it to be added to the deck
*/
function createCardElements(card, index){
    const li = document.createElement('li');
    const img = document.createElement('img');
    const cardID = document.createElement('span');

    img.src = card.images.small;
    cardID.innerText = card.id;
    cardID.setAttribute("id", index);
    cardID.addEventListener('click', addCardToDeck);

    li.appendChild(img);
    li.appendChild(cardID);

    return li;
}

//this function removes any children attached to the passed UL
//clears out previous search results / allows updated qty for displayed deck list
function clearUL(list){
    while(list.firstChild ){
        list.removeChild(list.firstChild );
    }
}

//class for the card objects to be added to the deck list
class Card {
    constructor(name, imageUrl, id) {
      this.name = name;
      this.imageUrl = imageUrl;
      this.id = id;
      this.quantity = 1;
    }

    //this function checks how many of this card is already in the deck
    //if its less than the maximum, it adds 1 card
    addCard(){
        if(this.quantity < 4){
            this.quantity++;
        }else{
            alert(`Max quantity of ${this.id} are in the deck`)
        }  
    }
}