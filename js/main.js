//event listener for deck building search button
document.querySelector('#searchForCard').addEventListener('click', searchForCard);
//deck build search result ul
const buildSearchResult = document.querySelector('#searchResult');

//event listener for display deck list button
document.querySelector('#showDeck').addEventListener('click', displayDeckList);
//display deck ul
const displayDeckUl = document.querySelector('#displayDeckList');
const totalCards = document.querySelector('#totalCards');
let numberOfCards = 0;

//holds the current deck being built
const currentDeck = [];

function searchForCard(){
    //grabs the card name
    let buildSearchInput = document.querySelector('#searchCardText').value;
    //add quotes for cards with multiple words
    buildSearchInput = `"${buildSearchInput}"`;
    console.log(buildSearchInput);

    //clears previous search results
    while(buildSearchResult.firstChild ){
        buildSearchResult.removeChild(buildSearchResult.firstChild );
    }

    fetch(`https://api.pokemontcg.io/v2/cards?q=name:${buildSearchInput}`)
        .then(response => response.json())
        .then(searchResponse => {
            //testing log
            console.log(searchResponse)
            
            //loop through result array
            for(let i = 0; i < searchResponse.data.length; i++){
                //create li, img, span
                const li = document.createElement('li');
                const img = document.createElement('img');
                const span = document.createElement('span');

                //set img src to search result image
                img.src = searchResponse.data[i].images.small;
                //set span text to card ID
                span.innerText = searchResponse.data[i].id;
                span.addEventListener('click', addCardToDeck);

                //append items to li element
                li.appendChild(img);
                li.appendChild(span);

                //append li the search result list
                buildSearchResult.appendChild(li);
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
    //remove previous entries to update quantities
    while( displayDeckUl.firstChild ){
        displayDeckUl.removeChild( displayDeckUl.firstChild );
    }

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