const zoom = require('../../zoom.app.js')

module.exports = {
  key: "zoom-meeting-updated",
  name: "Meeting Updated",
  description:
    "Emits an event each time a meeting is updated where you're the host",
  version: "0.0.2",
  dedupe: "unique", // dedupe on the meeting ID + timestamp
  props: {
    zoom,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      eventNames: ["meeting.updated"],
    },
  },
  async run(event) {
    const { payload } = event;
    const { object } = payload;
    this.$emit(event, {
      summary: `Meeting ${object.id} updated`,
      id: `${object.id}-${payload.time_stamp}`,
    });
  },
};
