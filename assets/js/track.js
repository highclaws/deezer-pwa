function removeGIFFromFavorite(event) {
    const likeButton = event.currentTarget;
    const gifId = likeButton.dataset.gifId;

    const gifElement = document.getElementById(gifId);
    const gifVideoUrl = gifElement.querySelector('source').src;
    const gifImageUrl = gifElement.querySelector('img').src;


    // TODO: 6b - Remove GIF from local database using its ID
   // db.groups.where('id').equals(gifId).delete();
    removeTrack(gifId);
    // TODO: 6c - Remove GIF media (image and video) from cache
    const cacheName = "tracks";
    caches
     .open(cacheName)
         .then( cache => {
             cache.delete(gifImageUrl)
             cache.delete(gifVideoUrl)
     })
    // Remove GIF element
    const articlesContainerElement = document.getElementById("tracks");
    articlesContainerElement.removeChild(gifElement);

}

function buildGIFCard(gifItem) {
    // Create GIF Card element
    const newGifElement = document.createElement("li");
    newGifElement.classList.add("list-group-item");
    newGifElement.id = gifItem.id;


    // Append metadata to card
    const gifMetaContainerElement = document.createElement("div");
    newGifElement.appendChild(gifMetaContainerElement);

    // Append title to card metadata
    const gifTitleElement = document.createElement("h3");
    const gifTitleNode = document.createTextNode(gifItem.name || 'No title');
    gifTitleElement.appendChild(gifTitleNode);
    gifMetaContainerElement.appendChild(gifTitleElement);

    // Append remove button to card metadata
    const removeButtonElement = document.createElement("button");
    removeButtonElement.setAttribute('aria-label', `Remove ${gifItem.name}`);
    removeButtonElement.dataset.gifId = gifItem.id;
    removeButtonElement.onclick = removeGIFFromFavorite;
    removeButtonElement.innerHTML = "Delete"

    const imageSourceElement = document.createElement('img');
    imageSourceElement.classList.add('lazyload');
    imageSourceElement.dataset.src = gifItem.name;
    imageSourceElement.alt = `${gifItem.name} image`;
    gifMetaContainerElement.appendChild(imageSourceElement);
    
    //gifMetaContainerElement.appendChild(removeButtonElement);

    // test


    const menu = document.createElement("button");
    menu.dataset.toggle = "collapse";
    menu.dataset.target = "#demo"+gifItem.id;

    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-bars");
    menu.appendChild(icon);

    const content = document.createElement("div");
    content.setAttribute("id", "demo"+gifItem.id);
    content.classList.add("collapse");
    content.appendChild(removeButtonElement);

    gifMetaContainerElement.appendChild(content);

    gifMetaContainerElement.appendChild(menu);

    // Append GIF Card to DOM
    const articlesContainerElement = document.getElementById("tracks");
    articlesContainerElement.appendChild(newGifElement);
}

window.addEventListener("DOMContentLoaded", async function () {
    // TODO: 5b - Fetch saved GIFs from local database and display them (use function buildGIFCard)
    const all = await db.tracks.toArray();
    test(all);
    
    await db.tracks.each(track=>{
        console.log(track);
        buildGIFCard(track);
    })
});

function name(params) {
    // Playlist array
    var files = all;

    // Current index of the files array
    var i = 0;

    // Get the audio element
    var music_player = document.querySelector("#tracks audio");

    // function for moving to next audio file
    function next() {
        // Check for last audio file in the playlist
        if (i === files.length - 1) {
            i = 0;
        } else {
            i++;
        }

        // Change the audio element source
        music_player.src = files[i];
    }

    // Check if the player is selected
    if (music_player === null) {
        throw "Playlist Player does not exists ...";
    } else {
        // Start the player
        music_player.src = files[i];

        // Listen for the music ended event, to play the next audio file
        music_player.addEventListener('ended', next, false)
    }
}
function PlayMusic2(musics) {
    const ap = new APlayer({
        container: document.getElementById('tracks'),
        mini: false,
        autoplay: false,
        theme: '#FADFA3',
        loop: 'all',
        order: 'random',
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        listFolded: false,
        listMaxHeight: 90,
        lrcType: 3,
        audio: musics
    });
}