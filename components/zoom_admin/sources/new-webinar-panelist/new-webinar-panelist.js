const zoom_admin = require("../../zoom_admin.app");

module.exports = {
  name: "New Panelists for Webinar",
  key: "zoom-admin-new-webinar-panelists",
  version: "0.0.3",
  description: "Emits an event every time a new panelist is added to a webinar",
  dedupe: "unique",
  props: {
    zoom_admin,
    webinars: { propDefinition: [zoom_admin, "webinars"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit sample events
      await this.fetchAndEmitParticipants();
    },
  },
  methods: {
    generateMeta(panelist) {
      const { id, email, name } = panelist;
      const summary = name ? `${name} - ${email}` : email;
      return {
        id,
        summary,
      };
    },
    async fetchAndEmitParticipants() {
      // This endpoint allows for no time filter, so we fetch all participants from
      // all configured webinars and let the deduper handle duplicates
      const webinars = this.webinars || [];
      if (!this.webinars || !this.webinars.length) {
        let nextPageToken;
        do {
          const resp = await this.zoom_admin.listWebinars({
            nextPageToken,
          });
          for (const webinar of resp.webinars) {
            webinars.push(webinar.id);
          }
          nextPageToken = resp.next_page_token;
        } while (nextPageToken);
      }

      for (webinarID of webinars) {
        const { panelists } = await this.zoom_admin.listWebinarPanelists(
          webinarID
        );
        for (const panelist of panelists) {
          this.$emit({ ...panelist, webinarID }, this.generateMeta(panelist));
        }
      }
    },
  },
  async run(event) {
    await this.fetchAndEmitParticipants();
  },
};
