import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-contact-in-list",
  name: "New Contact in List",
  description: "Emits an event for each new contact in a list.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    lists: {
      propDefinition: [
        common.props.hubspot,
        "lists",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(contact, list) {
      const {
        vid,
        properties,
      } = contact;
      const {
        value,
        label,
      } = list;
      return {
        id: `${vid}${value}`,
        summary: `${properties.firstname.value} ${properties.lastname.value} added to ${label}`,
        ts: Date.now(),
      };
    },
    async emitEvent(contact, properties, list) {
      const contactInfo = await this.hubspot.getContact(
        contact.vid,
        properties,
      );
      const meta = this.generateMeta(contact, list);
      this.$emit({
        contact,
        contactInfo,
      }, meta);
    },
  },
  async run() {
    const properties = this.db.get("properties");
    for (let list of this.lists) {
      const params = {
        count: 100,
      };
      let hasMore = true;
      while (hasMore) {
        const results = await this.hubspot.getListContacts(params, list.value);
        hasMore = results["has-more"];
        if (hasMore) params.vidOffset = results["vid-offset"];
        for (const contact of results.contacts) {
          await this.emitEvent(contact, properties, list);
        }
      }
    }
  },
};
