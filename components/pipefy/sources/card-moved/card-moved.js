const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "Card Moved (Instant)",
  key: "pipefy-card-moved",
  description: "Emits an event each time a card is moved in a Pipe.",
  version: "0.0.2",
  methods: {
    ...common.methods,
    getActions() {
      return ["card.move"];
    },
    getMeta(card, cardData) {
      return {
        body: cardData,
        id: `${card.id}${Date.now()}`,
        summary: `${card.title} moved from ${cardData.from.name} to ${cardData.to.name}`,
      };
    },
  },
};