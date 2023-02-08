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

function searchForCard(){
    //grabs the card name
    let buildSearchInput = document.querySelector('#searchCardText').value;
    //add quotes for cards with multiple words
    buildSearchInput = `"${buildSearchInput}"`;
    console.log(buildSearchInput);


    clearUL(buildSearchResult);

    fetch(`https://api.pokemontcg.io/v2/cards?q=name:${buildSearchInput}`)
        .then(response => response.json())
        .then(searchResponse => {
            let currentSearch = searchResponse.data;
            //testing log
            console.log(currentSearch)
            
            for(let i = 0; i < searchResponse.data.length; i++){
                buildSearchResult.appendChild(createCardElements(currentSearch[i]));
            }
        });
}

//event listener for clicked card
function addCardToDeck(){
    if(confirm(`Add ${this.innerText} to the deck?`)){
        //gets the response from the specific id
        fetch(`https://api.pokemontcg.io/v2/cards?q=id:${this.innerText}`)
            .then(response => response.json())
            .then(searchResponse => {
                //add the card info to deck list
                //check number of cards in deck is less than 60
                if (numberOfCards <= 59){
                    //check if the card is already in the deck
                    const i = currentDeck.findIndex(e => e.id === searchResponse.data[0].id);
                    if (i > -1 ) {
                        //card exists at index "i"
                        //and there are less than 4 copies
                        if(currentDeck[i].quantity < 4){
                            if(confirm(`Card exists in deck. qty: ${currentDeck[i].quantity}. Add another copy?`)){
                                currentDeck[i].quantity++;
                                numberOfCards++;
                                alert(`Quantity is now ${currentDeck[i].quantity}`)
                            }else{
                                alert('Card not added');
                            }
                        }else{
                            alert('Quantity 4 of each card is the maximum')
                        }
                    }else{
                        //not in the deck
                        alert('Card added')
                        //creats an object with the card info, sets qty to 1
                        let card = {
                            id: searchResponse.data[0].id,
                            name: searchResponse.data[0].name,
                            img: searchResponse.data[0].images.small,
                            quantity: 1
                        }
                        //adds the card
                        currentDeck.push(card);
                        numberOfCards++;
                    }
                }else{
                    alert('The deck is full!')
                }
            });
    }else{
        alert('Card not added');
    }
}

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

//this function creates and returns an li element with the card's image and id
//adds an event listener to the id, allowing it to be added to the deck
function createCardElements(card){
    const li = document.createElement('li');
    const img = document.createElement('img');
    const id = document.createElement('span');

    img.src = card.images.small;
    id.innerText = card.id;
    id.addEventListener('click', addCardToDeck);

    li.appendChild(img);
    li.appendChild(id);

    return li;
}

//this function removes any children attached to the passed UL
//clears out previous search results / allows updated qty for displayed deck list
function clearUL(list){
    while(list.firstChild ){
        list.removeChild(list.firstChild );
    }
}