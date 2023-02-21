const trello = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");
const get = require("lodash.get");

module.exports = {
  name: "New Comments on Card (Instant)",
  description: "Emits an event for each new comment added to a card.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    trello,
    boardId: { propDefinition: [trello, "boardId"] },
    cardIds: {
      propDefinition: [trello, "cardIds", (c) => ({ boardId: c.boardId })],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },

  hooks: {
    async activate() {
      let modelId = this.boardId;
      if (!this.boardId) {
        const member = await this.trello.getMember("me");
        modelId = member.id;
      }
      const { id } = await this.trello.createHook({
        id: modelId,
        endpoint: this.http.endpoint,
      });
      this.db.set("hookId", id);
      this.db.set("boardId", this.boardId);
      this.db.set("cardIds", this.cardIds);
    },
    async deactivate() {
      console.log(this.db.get("hookId"));
      await this.trello.deleteHook({
        hookId: this.db.get("hookId"),
      });
    },
  },

  async run(event) {
    // validate signature
    if (
      !this.trello.verifyTrelloWebhookRequest(
        event,
        this.http.endpoint
      )
    ) {
      return;
    }

    const body = get(event, "body");
    if (!body) {
      return;
    }

    const eventType = get(body, "action.type");
    if (eventType !== "commentCard") {
      return;
    }

    const cardId = get(body, "action.data.card.id");
    const boardId = this.db.get("boardId");
    const cardIds = this.db.get("cardIds");
    const comment = get(body, "action.data.text");
    card = await this.trello.getCard(cardId);

    if (
      (boardId && boardId !== card.idBoard) ||
      (cardIds && cardIds.length > 0 && !cardIds.includes(card.id))
    ) {
      return;
    }

    if (boardId && boardId !== card.idBoard) return;
    if (cardIds && cardIds.length > 0 && !cardIds.includes(card.id)) return;

    this.$emit(card, {
      id: card.id,
      summary: comment,
      ts: Date.now(),
    });
  },
};
