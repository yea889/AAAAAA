import common from "../common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "getresponse-new-contact",
  name: "New Contact",
  description: "Emit new event when a contact is created. [See the docs here](https://apireference.getresponse.com/?_ga=2.47520738.499257728.1666974700-2116668472.1666974700&amp;_gl=1*1f3h009*_ga*MjExNjY2ODQ3Mi4xNjY2OTc0NzAw*_ga_EQ6LD9QEJB*MTY2Njk3NzM0Ny4yLjEuMTY2Njk3ODQ3OS4zNi4wLjA.#operation/getContactList)",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getContacts;
    },
    getResourceFnArgs() {
      return {
        params: {
          [constants.QUERY_PROP.CREATED_ON_FROM]: this.getLastCreatedAt(),
          [constants.SORT_PROP.CREATED_ON]: "DESC",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.contactId,
        ts: Date.parse(resource.createdOn),
        summary: `Contact ID ${resource.contactId}`,
      };
    },
  },
};
