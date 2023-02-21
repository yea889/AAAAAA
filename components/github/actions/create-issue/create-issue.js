const github = require("../../github.app.js");
const { Octokit } = require("@octokit/rest");

module.exports = {
  key: "github-create-issue",
  name: "Create Issue",
  description: "Create a new issue in a Gihub repo.",
  version: "0.0.1",
  type: "action",
  props: {
    github,
    repoFullName: {
      propDefinition: [
        github,
        "repoFullName",
      ],
    },
    title: {
      propDefinition: [
        github,
        "issueTitle",
      ],
    },
    body: {
      propDefinition: [
        github,
        "issueBody",
      ],
    },
    labels: {
      propDefinition: [
        github,
        "labelNames",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
      description: "String array with the names of the labels to add to the issue.",
      optional: true,
    },
    milestone: {
      propDefinition: [
        github,
        "milestone",
        (c) => ({
          repoFullName: c.repoFullName,
        }),
      ],
      optional: true,
    },
    assignees: {
      propDefinition: [
        github,
        "issueAssignees",
      ],
    },
  },
  async run() {
    const octokit = new Octokit({
      auth: this.github.$auth.oauth_access_token,
    });
    const result = await this.github._withRetries(
      () =>  octokit.issues.create({
        owner: this.repoFullName.split("/")[0],
        repo: this.repoFullName.split("/")[1],
        title: this.title,
        body: this.body,
        labels: this.labels,
        assignees: this.assignees,
        milestone: this.milestone,
      }),
    );
    return result.data;
  },
};
