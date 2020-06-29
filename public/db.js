// Import stylesheets

// Write TypeScript code!
//const appDiv = document.getElementById('app');
//appDiv.innerHTML = `<h1>Dexie Many to Many TypeScript Starter</h1>`;
class Track {
    constructor(name, url) { this.name = name, this.url = url; }
}
class Playlist {
    constructor(name) { this.name = name; }
}
class UserInGroup {
    constructor() { }
}
class MyAppDatabase extends Dexie {
    constructor() {
        super("MyAppDatabase");
        this.version(1).stores({
            tracks: '++id, name, url',
            playlists: '++id, name',
            tracksInPlaylists: '[trackId+playlistId],trackId,playlistId'
        });
        this.tracks = this.table('tracks');
        this.playlists = this.table('playlists');
        this.tracksInPlaylists = this.table('tracksInPlaylists');
    }
}

const db = new MyAppDatabase();

async function putTrack(track) {
    return await db.tracks.put(track);
}
async function removeTrack(trackId) {
    return await db.table("tracks").where('id').equals(trackId).delete();
}

async function putPlaylist(playlist) {
    return await db.playlists.put(playlist);
}
async function getPlaylistInfo(playlistID) {
    return await db.table("playlists").where('id').equals(parseInt(playlistID) ).toArray();
}

async function removePlaylist(playlistID) {
    return await db.playlists.where('id').equals(parseInt(playlistID)).delete();
}

async function putTrackInPlaylist(track, playlist) {
    return await db.tracksInPlaylists.put({ trackId: track.id, playlistId: playlist.id });
}

async function removeTrackFromPlaylist(trackId, playlistId) {
    return await db.table("tracksInPlaylists").delete([trackId, playlistId]);
}


async function getAllTrackInPlaylist(playlist) {
    const groupLinks = await db.tracksInPlaylists.where({ playlistId: playlist.id }).toArray();
    const users = await Promise.all(groupLinks.map(link => db.table("tracks").get(link.trackId)));
    return users;
}

async function getAllTrackInPlaylistID(playlistID) {
    const groupLinks = await db.tracksInPlaylists.where({ playlistId: parseInt(playlistID) }).toArray();
    const users = await Promise.all(groupLinks.map(link => db.table("tracks").get(link.trackId)));
    return users;
}

function putTrackInPlaylistC(track, playlist) {
    return db.transaction('rw', db.tracks, db.playlists, db.tracksInPlaylists, async () => {
        const [validUser, validGroup] = await Promise.all([
            db.tracks.where({ id: track.id }).count(),
            db.playlists.where({ id: playlist.id }).count()
        ]);
        if (!validUser)
            throw new Error('Invalid user');
        if (!validGroup)
            throw new Error('Invalid group');
        await db.tracksInPlaylists.put({ trackId: track.id, playlistId: playlist.id });
    });
}
function getTrackInPlaylistC(track) {
    return db.transaction('r', db.tracksInPlaylists, db.groups, async () => {
        const groupLinks = await db.tracksInPlaylists.where({ trackId: track.id }).toArray();
        const groups = await Promise.all(groupLinks.map(link => db.playlists.get(link.playlistId)));
        return groups;
    });
}
//
