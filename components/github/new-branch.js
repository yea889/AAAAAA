const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");
//const github = require("./github.app.js");
const events = ["create"];
const eventTypes = ['branch'];

module.exports = {
  name: "New Branch (Instant)",
  description: "Triggers when a new branch is created",
  version: "0.0.2",
  props: {
    github,
    repoFullName: { propDefinition: [github, "repoFullName"] },
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const secret = await this.github.generateSecret();
      const { id } = await this.github.createHook({
        repoFullName: this.repoFullName,
        endpoint: this.http.endpoint,
        events,
        secret,
      });
      this.db.set("hookId", id);
      this.db.set("secret", secret);
    },
    async deactivate() {
      await this.github.deleteHook({
        repoFullName: this.repoFullName,
        hookId: this.db.get("hookId"),
      });
    },
  },
  methods: {
    generateMeta(data) {
      return {
        summary: `New Branch: ${data.ref} by ${data.sender.login}`,
      };
    },
  },
  async run(event) {
    const { body, headers } = event;

    if (headers["X-Hub-Signature"]) {
      const crypto = require("crypto");
      const algo = "sha1";
      const hmac = crypto.createHmac(algo, this.db.get("secret"));
      hmac.update(body, "utf-8");
      if (headers["X-Hub-Signature"] !== `${algo}=${hmac.digest("hex")}`) {
        throw new Error("signature mismatch");
      }
    }

    if ("zen" in body) {
      console.log("Zen event to confirm subscription, nothing to emit");
      return;
    }

    if (eventTypes.indexOf(body.ref_type) > -1) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
};
