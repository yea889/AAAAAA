const CUSTOM_EVENT_TYPES = [
  "meeting.alert",
  "meeting.created.by_me",
  "meeting.created.for_me",
  "meeting.updated",
  "meeting.deleted.by_me",
  "meeting.deleted.for_me",
  "meeting.started",
  "meeting.ended",
  "meeting.registration_created",
  "meeting.registration_approved",
  "meeting.registration_cancelled",
  "meeting.registration_denied",
  "meeting.sharing_started.host",
  "meeting.sharing_started.participant",
  "meeting.sharing_ended.host",
  "meeting.sharing_ended.participant",
  "meeting.participant_jbh_joined",
  "meeting.participant_jbh_waiting",
  "meeting.participant_joined",
  "meeting.participant_left",
  "meeting.participant_joined_waiting_room",
  "meeting.participant_admitted",
  "meeting.participant_put_in_waiting_room",
  "meeting.participant_left_waiting_room",
  "recording.started",
  "recording.paused",
  "recording.resumed",
  "recording.stopped",
  "recording.completed",
  "recording.trashed.by_me",
  "recording.trashed.for_me",
  "recording.deleted.by_me",
  "recording.deleted.for_me",
  "recording.recovered.by_me",
  "recording.recovered.for_me",
  "recording.transcript_completed",
  "recording.registration_created",
  "recording.registration_approved",
  "recording.registration_denied",
  "user.updated",
  "user.settings_updated",
  "user.signed_in",
  "user.signed_out",
  "webinar.created.by_me",
  "webinar.created.for_me",
  "webinar.updated",
  "webinar.started",
  "webinar.ended",
  "webinar.alert",
  "webinar.sharing_started.host",
  "webinar.sharing_started.participant",
  "webinar.sharing_ended",
  "webinar.registration_created",
  "webinar.registration_approved",
  "webinar.registration_denied",
  "webinar.registration_cancelled",
  "webinar.participant_joined",
  "webinar.participant_left",
];

const PHONE_EVENT_TYPES = [
  "phone.call_log_deleted",
  "phone.call_log_permanently_deleted",
  "phone.callee_answered",
  "phone.callee_call_log_completed",
  "phone.callee_ended",
  "phone.callee_hold",
  "phone.callee_meeting_inviting",
  "phone.callee_missed",
  "phone.callee_mute",
  "phone.callee_rejected",
  "phone.callee_ringing",
  "phone.callee_unhold",
  "phone.callee_unmute",
  "phone.caller_call_log_completed",
  "phone.caller_connected",
  "phone.caller_ended",
  "phone.caller_hold",
  "phone.caller_meeting_inviting",
  "phone.caller_mute",
  "phone.caller_ringing",
  "phone.caller_unhold",
  "phone.caller_unmute",
  "phone.device_registration",
  "phone.emergency_alert",
  "phone.generic_device_provision",
  "phone.peering_number_cnam_updated",
  "phone.peering_number_emergency_address_updated",
  "phone.recording_completed",
  "phone.recording_deleted",
  "phone.recording_paused",
  "phone.recording_permanently_deleted",
  "phone.recording_resumed",
  "phone.recording_started",
  "phone.recording_stopped",
  "phone.recording_transcript_completed",
  "phone.sms_received",
  "phone.sms_sent",
  "phone.voicemail_deleted",
  "phone.voicemail_permanently_deleted",
  "phone.voicemail_received",
  "phone.voicemail_transcript_completed",
  "phone.warm_transfer_accepted",
];

export default {
  CUSTOM_EVENT_TYPES,
  PHONE_EVENT_TYPES,
};
