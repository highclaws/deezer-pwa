const searchBar = document.getElementById('query');
const searchButton = document.getElementById('search-button');
const cancelButton = document.getElementById('cancel-button');
const loaderElement = document.getElementById('loader');
const gifsElement = document.getElementById('amplitude-right');

function disableSearch() {
    searchButton.style.display = 'none';
    cancelButton.style.display = null;
    searchBar.disabled = true;
}

function setLoading(isLoading) {
    if (isLoading) {
        loaderElement.style.display = null;
        gifsElement.style.display = 'none';
    }
    else {
        loaderElement.style.display = 'none';
        gifsElement.style.display = null;
    }
}

function addGIFToFavorite(event) {
    const likeButton = event.currentTarget;
    const gifId = likeButton.dataset.gifId;

    const gifElement = document.getElementById(gifId);

    const gifTitle = gifElement.querySelector('div h3').textContent;
    const gifVideoUrl = gifElement.querySelector('source').src;
    const gifImageUrl = gifElement.querySelector('img').dataset.src;

    const db = window.db;
    db.open()
        .catch(e => console.error('Could not open local db:', e));

    // Put GIF in local database
    db.transaction('rw', db.gifs, () => {
        db.gifs.add({
            id: gifId,
            title: gifTitle,
            imageUrl: gifImageUrl,
            videoUrl: gifVideoUrl,
        });
    }).catch(e => console.error(e));

    // Put GIF image in cache
    caches.open('gif-images')
        .then(cache => {
            cache.add(gifVideoUrl);
            cache.add(gifImageUrl);
        })
        .catch(e => console.error('Could not save GIF image to cache:', e));

    // Set button in 'liked' state (disable the button)
    likeButton.disabled = true;
}

function buildGIFCard(gifItem, isSaved,index) {
    // Create GIF Card element
    document.getElementById("blue-playlist-container").style.display = "block"; 
    $("#amplitude-right").append(
    `
        <div class="song amplitude-song-container amplitude-play-pause" data-amplitude-song-index="${index}">
            
            <div class="song-now-playing-icon-container">
                <div class="play-button-container"></div>
                <img class="now-playing" src="./assets/images/player/now-playing.svg"/>
            </div>

            <div class="song-meta-data">
                <span class="song-title">${gifItem.title}</span>
                <span class="song-artist">${gifItem.artist.name}</span>
            </div>

                <span class="song-duration">${gifItem.duration}</span>

            </div>
      

    `)

}

async function searchGIFs() {
    disableSearch();
    setLoading(true);

    const query = searchBar.value;
    console.log(query);

    var texte = document.getElementById("filter-input").options[document.getElementById('filter-input').selectedIndex].text;
    // const sel = document.getElementById('filter-input');
    // console.log(query);
    // const opt = sel.options[sel.selectedIndex];
    // Get the value of the option selected.
    console.log(texte);

    // TODO: 9a -  9b 
    
    const url = `https://cors-anywhere.herokuapp.com/http://api.deezer.com/search?q=${query}&order=${texte}&limit=20&output=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // TODO: Set error screen
            return;
        }
        const giphyResponse = await response.json();

        const gifs = giphyResponse.data;
        db.open().catch(e => console.error('Could not open database:', e));

        $('#amplitude-player').append(`
       
        `); 
        var itemsProcessed = 0;
        const arrayMusic = [];

        gifs.forEach(async (gif, index)  => {
            const savedGifs = await db.table("tracks").get(gif.id);
            const isSaved = typeof (savedGifs) !== 'undefined';
            const reformatMusic = {"name": gif.title, "artist": gif.artist.name,"url":gif.preview,"cover_art_url": gif.album.cover}
            arrayMusic.push(reformatMusic);
            buildGIFCard(gif, isSaved,index);
            itemsProcessed++;
            if(itemsProcessed === gifs.length) {
                callback(arrayMusic);
              }
    
        });
    

    } catch (e) {
        // TODO: Set error screen
    } finally {
        setLoading(false);
    }
}

function cancelSearch() {
    searchButton.style.display = null;
    cancelButton.style.display = 'none';

    while (gifsElement.firstChild) {
        gifsElement.firstChild.remove();
    }

    searchBar.value = null;
    searchBar.disabled = false;
    searchBar.focus();
}

window.addEventListener('DOMContentLoaded', async function () {
    
    searchBar.addEventListener('keyup', event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchGIFs();
        }
    });
    searchButton.addEventListener('click', searchGIFs);
    cancelButton.addEventListener('click', cancelSearch);
});

function callback (arrayMusic) { 
    checkMusic();

    Amplitude.init({
        "songs": arrayMusic
    });

}
