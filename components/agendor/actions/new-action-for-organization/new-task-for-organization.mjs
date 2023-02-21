import app from "../../agendor.app.mjs";

export default {
  type: "action",
  key: "new-task-for-organization",
  name: "New Task for Organization",
  description: "Create a new task for an organization",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {
    this.app.authKeys();
  },
};
