const zoomAdmin = require('../../zoom_admin.app.js')

module.exports = {
  key: "zoom_admin-custom-events",
  name: "Custom Events",
  description: "Listen for any events tied to your Zoom account",
  version: "0.0.2",
  props: {
    zoomAdmin,
    eventNameOptions: {
      label: "Zoom Events",
      type: "string[]",
      async options() {
        return [
          "account.created",
          "account.updated",
          "account.settings_updated",
          "account.disassociated",
          "meeting.alert",
          "meeting.created",
          "meeting.updated",
          "meeting.deleted",
          "meeting.started",
          "meeting.ended",
          "meeting.registration_created",
          "meeting.registration_approved",
          "meeting.registration_cancelled",
          "meeting.registration_denied",
          "meeting.sharing_started",
          "meeting.sharing_ended",
          "meeting.participant_jbh_joined",
          "meeting.participant_joined",
          "meeting.participant_left",
          "recording.started",
          "recording.paused",
          "recording.resumed",
          "recording.stopped",
          "recording.completed",
          "recording.renamed",
          "recording.trashed",
          "recording.deleted",
          "recording.recovered",
          "recording.transcript_completed",
          "recording.registration_created",
          "recording.registration_approved",
          "recording.registration_denied",
          "user.created",
          "user.invitation_accepted",
          "user.updated",
          "user.settings_updated",
          "user.deactivated",
          "user.activated",
          "user.disassociated",
          "user.deleted",
          "user.presence_status_updated",
          "user.personal_notes_updated",
          "user.signed_in",
          "user.signed_out",
          "webinar.created",
          "webinar.updated",
          "webinar.deleted",
          "webinar.started",
          "webinar.ended",
          "webinar.alert",
          "webinar.sharing_started",
          "webinar.sharing_ended",
          "webinar.registration_created",
          "webinar.registration_approved",
          "webinar.registration_denied",
          "webinar.registration_cancelled",
          "webinar.participant_joined",
          "webinar.participant_left",
          "zoomroom.alert",
          "zoomroom.delayed_alert",
        ];
      },
    },
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      async eventNames() {
        return this.eventNameOptions;
      },
    },
  },
  async run(event) {
    console.log(event);
    this.$emit(event, {
      summary: event.event,
    });
  },
};
