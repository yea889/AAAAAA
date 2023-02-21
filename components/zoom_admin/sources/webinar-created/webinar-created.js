const zoomAdmin = require('../../zoom_admin.app.js');

module.exports = {
  key: "zoom_admin-webinar-created",
  name: "Webinar Created",
  description:
    "Emits an event each time a webinar is created in your Zoom account",
  version: "0.0.2",
  dedupe: "unique", // Dedupe based on webinar ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["webinar.created"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(
      { event: "webinar.created", payload },
      {
        summary: `Webinar ${object.topic} created`,
        id: object.uuid,
        ts: +new Date(object.start_time),
      }
    );
  },
};
