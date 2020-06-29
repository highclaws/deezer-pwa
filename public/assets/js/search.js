const searchBar = document.getElementById('query');
const searchButton = document.getElementById('search-button');
const cancelButton = document.getElementById('cancel-button');
const loaderElement = document.getElementById('loader');
const gifsElement = document.getElementById('gifs');

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

function buildGIFCard(gifItem, isSaved) {
    // Create GIF Card element
    document.getElementById("blue-playlist-container").style.display = "block"; 
    $("#amplitude-right").append(
    `<div class="song amplitude-song-container amplitude-play-pause" data-amplitude-song-index="${gifItem.id}">
        <div class="song-now-playing-icon-container">
        <div class="play-button-container">
        </div>
        <img class="now-playing" src="./assets/images/player/now-playing.svg"/>
    </div>
    <div class="song-meta-data">
        <span class="song-title">${gifItem.title}</span>
        <span class="song-artist">${gifItem.artist.name}</span>
    </div>
    <a href="https://switchstancerecordings.bandcamp.com/track/risin-high-feat-raashan-ahmad" class="bandcamp-link" target="_blank">
        <img class="bandcamp-grey" src="./assets/images/player/bandcamp-grey.svg"/>
        <img class="bandcamp-white" src="./assets/images/player/bandcamp-white.svg"/>
    </a>
    <span class="song-duration">${gifItem.duration}</span>
    </div>`)
    /*
	When the bandcamp link is pressed, stop all propagation so AmplitudeJS doesn't
	play the song.
*/
let bandcampLinks = document.getElementsByClassName('bandcamp-link');

for( var i = 0; i < bandcampLinks.length; i++ ){
	bandcampLinks[i].addEventListener('click', function(e){
		e.stopPropagation();
	});
}


let songElements = document.getElementsByClassName('song');

for( var i = 0; i < songElements.length; i++ ){
	/*
		Ensure that on mouseover, CSS styles don't get messed up for active songs.
	*/
	songElements[i].addEventListener('mouseover', function(){
		this.style.backgroundColor = '#00A0FF';

		this.querySelectorAll('.song-meta-data .song-title')[0].style.color = '#FFFFFF';
		this.querySelectorAll('.song-meta-data .song-artist')[0].style.color = '#FFFFFF';

		if( !this.classList.contains('amplitude-active-song-container') ){
			this.querySelectorAll('.play-button-container')[0].style.display = 'block';
		}

		this.querySelectorAll('img.bandcamp-grey')[0].style.display = 'none';
		this.querySelectorAll('img.bandcamp-white')[0].style.display = 'block';
		this.querySelectorAll('.song-duration')[0].style.color = '#FFFFFF';
	});

	/*
		Ensure that on mouseout, CSS styles don't get messed up for active songs.
	*/
	songElements[i].addEventListener('mouseout', function(){
		this.style.backgroundColor = '#FFFFFF';
		this.querySelectorAll('.song-meta-data .song-title')[0].style.color = '#272726';
		this.querySelectorAll('.song-meta-data .song-artist')[0].style.color = '#607D8B';
		this.querySelectorAll('.play-button-container')[0].style.display = 'none';
		this.querySelectorAll('img.bandcamp-grey')[0].style.display = 'block';
		this.querySelectorAll('img.bandcamp-white')[0].style.display = 'none';
		this.querySelectorAll('.song-duration')[0].style.color = '#607D8B';
	});

	/*
		Show and hide the play button container on the song when the song is clicked.
	*/
	songElements[i].addEventListener('click', function(){
		this.querySelectorAll('.play-button-container')[0].style.display = 'none';
	});
}
    /*
    const favButtonElement = document.createElement('button');
    favButtonElement.setAttribute('aria-label', `Save ${gifItem.title}`);
    favButtonElement.classList.add('button');
    favButtonElement.dataset.gifId = gifItem.id;
    favButtonElement.onclick = addGIFToFavorite;

    const favIconElement = document.createElement('i');
    favIconElement.classList.add('fas', 'fa-heart');
    favButtonElement.appendChild(favIconElement);
    gifMetaContainerElement.appendChild(favButtonElement);
    */
    // Disable button (set GIF as liked) if liked
    /*
    if (isSaved) {
        favButtonElement.disabled = true;
    }

    // Append GIF Card to DOM
    const articlesContainerElement = document.getElementById('gifs');
    articlesContainerElement.appendChild(newGifElement);*/
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
        const arrayMusic = [];

        $('#amplitude-player').append(`
        <div id="amplitude-left">
            <img data-amplitude-song-info="cover_art_url"/>
            <div id="player-left-bottom">
            <div id="time-container">
            <span class="current-time">
                <span class="amplitude-current-minutes" ></span>:<span class="amplitude-current-seconds"></span>
            </span>
            <div id="progress-container">
                <input type="range" class="amplitude-song-slider"/>
                <progress id="song-played-progress" class="amplitude-song-played-progress"></progress>
                <progress id="song-buffered-progress" class="amplitude-buffered-progress" value="0"></progress>
            </div>
            <span class="duration">
                <span class="amplitude-duration-minutes"></span>:<span class="amplitude-duration-seconds"></span>
            </span>
            </div>
        
            <div id="control-container">
            <div id="repeat-container">
                <div class="amplitude-repeat" id="repeat"></div>
                <div class="amplitude-shuffle amplitude-shuffle-off" id="shuffle"></div>
            </div>
        
            <div id="central-control-container">
                <div id="central-controls">
                    <div class="amplitude-prev" id="previous"></div>
                    <div class="amplitude-play-pause" id="play-pause"></div>
                    <div class="amplitude-next" id="next"></div>
                </div>
            </div>
        
            <div id="volume-container">
                <div class="volume-controls">
                    <div class="amplitude-mute amplitude-not-muted"></div>
                    <input type="range" class="amplitude-volume-slider"/>
                    <div class="ms-range-fix"></div>
                </div>
                <div class="amplitude-shuffle amplitude-shuffle-off" id="shuffle-right"></div>
            </div>
            </div>
            
            <div id="meta-container">
                <span data-amplitude-song-info="name" class="song-name"></span>
            
                <div class="song-artist-album">
                    <span data-amplitude-song-info="artist"></span>
                    <span data-amplitude-song-info="album"></span>
                </div>
            </div>
            </div>
        </div>
        `); 
        gifs.forEach(async gif => {
            const savedGifs = await db.table("tracks").get(gif.id);
            const isSaved = typeof (savedGifs) !== 'undefined';
            const reformatMusic = {"name": gif.title, "artist": gif.artist.name,"url":gif.preview,"cover_art_url": gif.album.cover}
            arrayMusic.push(reformatMusic);
            buildGIFCard(gif, isSaved);

            //const savedGifs = await db.table("tracks").where('id').equals(parseInt((gif.id)));

            //const isSaved = typeof (savedGifs) !== 'undefined';
            //buildGIFCard(gif, isSaved);
        }).then(async () => {
             
            Amplitude.init({
                "songs": [
                    {
                        "name": "Le bal masqué",
                        "artist": "Opium du peuple",
                        "album": "La révolte des opiumettes",
                        "url": "./song/le-bal-masque.mp3",
                    },
                    {
                        "name": "Poupée de cire, poupée de son",
                        "artist": "Opium du peuple",
                        "album": "La révolte des opiumettes",
                        "url": "./song/poupee-de-cire.mp3",
                    }
                ],
                callbacks: {
                    //pour démarrer la lecture à cuaque fois que l'on passe au morceau suivant ou préc
                    song_change: function () {
                        Amplitude.play();
                    }
                }
            });
            

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