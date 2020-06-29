function removeGIFFromFavorite(event) {
    const likeButton = event.currentTarget;
    const gifId = likeButton.dataset.gifId;

    const gifElement = document.getElementById(gifId);
    const gifVideoUrl = gifElement.querySelector('source').src;
    const gifImageUrl = gifElement.querySelector('img').src;


    // TODO: 6b - Remove GIF from local database using its ID
   // db.groups.where('id').equals(gifId).delete();
    removePlaylist(gifId);
    // TODO: 6c - Remove GIF media (image and video) from cache
    const cacheName = "playlists";
    caches
     .open(cacheName)
         .then( cache => {
             cache.delete(gifImageUrl)
             cache.delete(gifVideoUrl)
     })
    // Remove GIF element
    const articlesContainerElement = document.getElementById("gifs");
    articlesContainerElement.removeChild(gifElement);

}

function buildGIFCard(gifItem) {
    // Create GIF Card element
    const newGifElement = document.createElement("div");
    newGifElement.classList.add("card","card-custom","mx-2", "mb-3");
    newGifElement.id = gifItem.id;

    const newUrlElement = document.createElement("a");
    newUrlElement.classList.add("card-body");
    newUrlElement.id = gifItem.id;
    newUrlElement.href = "playlist?id="+gifItem.id;      
    
    // Append image to card
    const gifImageElement = document.createElement('video');
    gifImageElement.autoplay = true;
    gifImageElement.loop = true;
    gifImageElement.muted = true;
    gifImageElement.setAttribute('playsinline', true);

    const videoSourceElement = document.createElement('source');
    videoSourceElement.src = gifItem.name;
    videoSourceElement.type = 'video/mp4';
    gifImageElement.appendChild(videoSourceElement);

    const imageSourceElement = document.createElement('img');
    imageSourceElement.classList.add('card-img-top');
    imageSourceElement.dataset.src = gifItem.name;
    imageSourceElement.alt = `${gifItem.name} image`;
    gifImageElement.appendChild(imageSourceElement);

    newUrlElement.appendChild(gifImageElement);

    newGifElement.appendChild(newUrlElement);

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
    const articlesContainerElement = document.getElementById("gifs");
    articlesContainerElement.appendChild(newGifElement);
}

window.addEventListener("DOMContentLoaded", async function () {
    // TODO: 5b - Fetch saved GIFs from local database and display them (use function buildGIFCard)
    await db.playlists.each(playlist=>{
        console.log(playlist);
        buildGIFCard(playlist);
    })
});
