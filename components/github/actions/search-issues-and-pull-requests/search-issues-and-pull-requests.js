const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-search-issues-and-pull-requests",
  name: "Search Issues and Pull Requests",
  description: "Find issues by state and keyword.",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    q: {
      propDefinition: [
        github,
        "q_issues_and_pull_requests",
      ],
    },
    sort: {
      propDefinition: [
        github,
        "sortIssues",
      ],
    },
    order: {
      propDefinition: [
        github,
        "order",
      ],
    },
    paginate: {
      propDefinition: [
        github,
        "paginate",
      ],
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    if (this.paginate) {
      return await this.github._withRetries(
        () => octokit.paginate(octokit.search.users, {
          q: `${this.q} type:user`,
          sort: this.sort,
          order: this.order,
          per_page: 100,
        }),
      );
    } else {
      const result = await this.github._withRetries(
        () => octokit.search.users({
          q: this.q,
          sort: this.sort,
          order: this.order,
          per_page: 100,
        }),
      );
      return result.data.items;
    }
  },
};
