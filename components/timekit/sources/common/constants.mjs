export default {
  graphs: [
    "instant",
    "instant_payment",
    "confirm_decline",
    "group_owner",
    "group_customer",
    "group_customer_payment",
    "reservation",
  ],
  states: {
    INSTANT: [
      "confirmed",
      "completed",
      "cancelled",
      "cancelled_by_customer",
      "rescheduled_by_customer",
      "error",
      "other",
    ],
    INSTANT_PAYMENT: [
      "tentative",
      "paid",
      "unpaid",
      "completed",
      "cancelled",
      "cancelled_by_customer",
      "rescheduled_by_customer",
      "error",
    ],
    CONFIRM_DECLINE: [
      "tentative",
      "declined",
      "confirmed",
      "completed",
      "cancelled",
      "cancelled_by_customer",
      "rescheduled_by_customer",
      "error",
    ],
    GROUP_OWNER: [
      "tentative",
      "completed",
      "cancelled",
      "error",
    ],
    GROUP_CUSTOMER: [
      "confirmed",
      "completed",
      "cancelled_by_customer",
      "cancelled_by_owner",
      "error",
    ],
    GROUP_CUSTOMER_PAYMENT: [
      "tentative",
      "paid",
      "unpaid",
      "completed",
      "cancelled_by_owner",
      "cancelled_by_customer",
      "error",
    ],
    RESERVATION: [
      "reserved",
      "expired",
    ],
  },
};
