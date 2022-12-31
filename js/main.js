//event listener for deck building search button
document.querySelector('#searchForCard').addEventListener('click', searchForCard)

//deck build search result ul
const buildSearchResult = document.querySelector('#searchResult')

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
                //create li and img
                const li = document.createElement('li');
                const img = document.createElement('img');
                //set img src to search result image
                img.src = searchResponse.data[i].images.small;
                li.appendChild(img);
                //append to the search result list
                buildSearchResult.appendChild(li);
            }
        });

}

// build a deck, save to local storage
// standard only?
// search for card, add to array. Limit of 60 cards, 4 of each card except energy

// test saved deck
// list of decks by name, select one to use that value in the js methods

// draw a starting hand
// use chosen deck, shuffle array, 'draw' 7 cards
// if no basic mons, reshuffle and draw again

// set prizes
// 'draw' 6 more cards