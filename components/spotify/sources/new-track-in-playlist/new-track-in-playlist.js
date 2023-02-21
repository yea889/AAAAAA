const spotify = require("../../spotify.app.js");

module.exports = {
  key: "spotify-new-track-in-playlist",
  name: "New Track in Playlist",
  description: "Emit an event for each new Spotify track added to a playlist",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    spotify,
    playlists: {
      type: "string[]",
      label: "Playlist",
      description: "Search for new tracks added to the specified playlist(s).",
      async options({ page, prevContext }) {
        const limit = 20;
        const offset = prevContext.offset ? prevContext.offset : 0;
        const results = await this.spotify.getPlaylists({ limit, offset });
        const options = results.data.items.map((playlist) => {
          return { label: playlist.name, value: playlist.id };
        });
        const newOffset = prevContext+limit;
        return {
          options,
          context: { newOffset },
        };
      },
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let results;
    let addedAt;
    let total = 1;
    let count = 0;
    let limit = 100;
    let offset = 0;

    const now = new Date();
    const monthAgo = new Date(now.getTime());
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let lastEvent = this.db.get("lastEvent") || monthAgo;
    lastEvent = new Date(lastEvent);

    let params = {
      limit,
      offset,
    };

    for (playlistId of this.playlists) {
      let i = 0;
      params.offset = 0;
      while (count < total && i < total) {
        results = await this.spotify.getPlaylistItems(playlistId, params);
        total = results.data.total;
        for (const track of results.data.items) {
          addedAt = new Date(track.added_at);
          if (addedAt.getTime() > lastEvent.getTime()) {
            this.$emit(track, {
              id: track.track.id,
              summary: track.track.name,
              ts: track.added_at,
            });
          }
          count++;
        }
        i++;
        params.offset += limit;
      }
      count = 0;
      total = 1;
    }  

    this.db.set("lastEvent", now);
  },
};