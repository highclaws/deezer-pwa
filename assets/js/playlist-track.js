    // TODO: 5b - Fetch saved GIFs from local database and display them (use function buildGIFCard)
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const ParamId = urlParams.get('id');

function removeGIFFromFavorite(event) {
    const likeButton = event.currentTarget;
    const gifId = likeButton.dataset.gifId;

    const gifElement = document.getElementById(gifId);
    const gifVideoUrl = gifElement.querySelector('source').src;
    const gifImageUrl = gifElement.querySelector('img').src;


    // TODO: 6b - Remove GIF from local database using its ID
   // db.groups.where('id').equals(gifId).delete();
    removeTrackFromPlaylist(gifId.id,ParamId );
    // TODO: 6c - Remove GIF media (image and video) from cache
    const cacheName = "groups";
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
    removeButtonElement.classList.add("button");
    removeButtonElement.dataset.gifId = gifItem.id;
    removeButtonElement.onclick = removeGIFFromFavorite;
    
    const removeIconElement = document.createElement("i");
    removeIconElement.classList.add("fas", "fa-times");
    removeButtonElement.appendChild(removeIconElement);
    gifMetaContainerElement.appendChild(removeButtonElement);

    // Append GIF Card to DOM
    const articlesContainerElement = document.getElementById("tracks");
    articlesContainerElement.appendChild(newGifElement);
}

window.addEventListener("DOMContentLoaded", async function () {


    getAllTrackInPlaylistID(ParamId).then( result => {
        //console.log(result);
        
        result.forEach(track => {
            console.log(track);
            buildGIFCard(track);
        });
   });

   getPlaylistInfo(ParamId).then(result => {
        console.log(result);
        document.getElementById("namePlaylist").innerHTML = result[0].name; 

    });

});
