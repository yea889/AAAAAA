import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "typeform-lookup-responses",
  name: "Lookup Responses",
  description: "Search for responses with the `query` property. [See the docs here](https://developer.typeform.com/responses/reference/retrieve-responses/)",
  type: "action",
  version: "0.0.1",
  props: {
    typeform,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
    query: {
      propDefinition: [
        typeform,
        "query",
      ],
    },
    pageSize: {
      propDefinition: [
        typeform,
        "pageSize",
      ],
    },
    since: {
      propDefinition: [
        typeform,
        "since",
      ],
    },
    until: {
      propDefinition: [
        typeform,
        "until",
      ],
    },
    after: {
      propDefinition: [
        typeform,
        "after",
      ],
    },
    before: {
      propDefinition: [
        typeform,
        "before",
      ],
    },
  },
  async run({ $ }) {
    const {
      formId,
      query,
      pageSize,
      since,
      until,
      after,
      before,
    } = this;

    const params = {
      query,
      page_size: pageSize,
      since,
      until,
      after,
      before,
    };

    const { items } = await this.typeform.getResponses({
      $,
      formId,
      params,
    });

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `🎉 Found ${items.length} form ${items.length == 1 ? `response` : `responses`} based on the provided query`)

    return items;
  },
};
