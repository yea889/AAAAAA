const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "Card Field Updated (Instant)",
  key: "pipefy-card-field-updated",
  description: "Emits an event each time a card field is updated in a Pipe.",
  version: "0.0.2",
  methods: {
    ...common.methods,
    getActions() {
      return ["card.field_update"];
    },
    getMeta(card, cardData) {
      return {
        body: { card, cardData },
        id: `${card.id}${Date.now()}`,
        summary: `${card.title} ${cardData.field.label} updated`,
      };
    },
  },
};