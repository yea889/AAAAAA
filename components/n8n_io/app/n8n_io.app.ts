import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "n8n_io",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
});