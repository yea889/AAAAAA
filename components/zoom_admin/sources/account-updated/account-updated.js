const zoomAdmin = require('../../zoom_admin.app.js')

module.exports = {
  key: "zoom_admin-account-updated",
  name: "Account Updated",
  description:
    "Emits an event each time your master account or sub-account profile is updated",
  version: "0.0.2",
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: ["account.updated"],
    },
  },
  async run(event) {
    console.log(event);
    const { payload } = event;
    const { id } = payload.object;
    this.$emit(event, {
      summary: JSON.stringify(payload.object),
      id: `${id}-${payload.time_stamp}`,
    });
  },
};
