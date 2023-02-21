const twilio = require("../twilio.app.js");

module.exports = {
  props: {
    twilio,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    _getCreatedAfter() {
      return this.db.get("createdAfter");
    },
    _setCreatedAfter(createdAfter) {
      this.db.set("createdAfter", createdAfter);
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
  },
  async run(event) {
    let dateCreatedAfter = this._getCreatedAfter();
    const params = {
      dateCreatedAfter,
    };
    const results = await this.listResults(params);
    for (const result of results) {
      this.emitEvent(result);
      if (
        !dateCreatedAfter ||
        Date.parse(result.dateCreated) > Date.parse(dateCreatedAfter)
      )
        dateCreatedAfter = result.dateCreated;
    }
    this._setCreatedAfter(dateCreatedAfter);
  },
};