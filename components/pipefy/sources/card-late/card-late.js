const common = require("../common-polling.js");

module.exports = {
  ...common,
  name: "Card Late",
  key: "pipefy-card-late",
  description: "Emits an event each time a card becomes late in a Pipe.",
  version: "0.0.1",
  methods: {
    isCardRelevant({ node }) {
      return (
        node.late && 
        !node.done
      );
    },
    getMeta({ node, event }) {
      const {
        id: nodeId,
        title: summary,
        current_phase: { id: currentPhaseId },
      } = node;
      const id = `${nodeId}${currentPhaseId}`;
      const { timestamp: ts } = event;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};