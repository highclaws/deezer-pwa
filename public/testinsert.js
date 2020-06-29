async function test() {
    //db.delete();
    //db.open();
   // await Promise.all([db.users.clear(), db.groups.clear(), db.usersInGroups.clear()]);
    /**
    | userid | groupid |
    | :----: | :-----: |
    |   1    |    1    |
    |   1    |    2    |
    |   2    |    3    |
    |   3    |    3    |
     */
    const track1 = new Track('track1', 'url');
    await putTrack(track1);
    const track2 = new Track('track2', 'url');
    await putTrack(track2);
    const track3 = new Track('track3', 'url');
    await putTrack(track3);

    const playlist1 = new Playlist('playlist1');
    await putPlaylist(playlist1);
    const playlist2 = new Playlist('playlist2');
    await putPlaylist(playlist2);
    const playlist3 = new Playlist('playlist3');
    await putPlaylist(playlist3);
    /**
    | userid | groupid |
    | :----: | :-----: |
    |   1    |    1    |
    |   1    |    2    |
    |   2    |    3    |
    |   3    |    3    |
     */
    await putTrackInPlaylist(track1, playlist1);
    await putTrackInPlaylist(track2, playlist2);
    await putTrackInPlaylist(track3, playlist3);

    await putTrackInPlaylist(track1, playlist3);
    await putTrackInPlaylist(track2, playlist3);

    let usersForGroup1 = await getAllTrackInPlaylist(playlist3);
    let usersForGroup2 = await getAllTrackInPlaylist(playlist2);
    let usersForGroup3 = await getAllTrackInPlaylist(playlist1);
    /**
    | userid | groupid |
    | :----: | :-----: |
    |   1    |    1    |
    |   1    |    2    |
    |   2    |    3    |
    |   3    |    3    |
     */

    console.log("usersForGroup1-[1]", JSON.stringify(usersForGroup1)); // Should log group1
    console.log("usersForGroup2-[1]", JSON.stringify(usersForGroup2)); // Should log group1
    console.log("usersForGroup3-[2,3]", JSON.stringify(usersForGroup3)); // Should log group1  
}

console.log("ici");
const query = searchBar.value;
var texte = document.getElementById("typeMusic").options[document.getElementById('typeMusic').selectedIndex].text;
// const sel = document.getElementById('filter-input');
// console.log(query);
// const opt = sel.options[sel.selectedIndex];
// Get the value of the option selected.

// TODO: 9a -  9b 

const url = `https://cors-anywhere.herokuapp.com/http://api.deezer.com/search?q=${query}&order=${texte}&limit=20&output=json`;