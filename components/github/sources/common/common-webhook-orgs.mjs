import github from "../../github.app.mjs";

export default {
  props: {
    github,
    org: {
      propDefinition: [
        github,
        "orgName",
      ],
    },
    repo: {
      propDefinition: [
        github,
        "repoOrg",
        (c) => ({
          org: c.org,
        }),
      ],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookEvents() {
      throw new Error("getWebhookEvents is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    loadHistoricalEvents() {
      return true;
    },
  },
  hooks: {
    async deploy() {
      await this.loadHistoricalEvents();
    },
    async activate() {
      const response = await this.github.createOrgWebhook({
        org: this.org,
        data: {
          name: "web",
          config: {
            url: this.http.endpoint,
            content_type: "json",
          },
          events: this.getWebhookEvents(),
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.github.removeOrgWebhook({
        org: this.org,
        webhookId,
      });
    },
  },
};
