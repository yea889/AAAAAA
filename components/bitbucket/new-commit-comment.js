const common = require("./common");
const { bitbucket } = common.props;

const EVENT_SOURCE_NAME = "New Commit Comment (Instant)";

module.exports = {
  ...common,
  name: EVENT_SOURCE_NAME,
  description: "Emits an event when a commit receives a comment",
  version: "0.0.1",
  props: {
    ...common.props,
    repositoryId: {
      propDefinition: [
        bitbucket,
        "repositoryId",
        c => ({ workspaceId: c.workspaceId }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventSourceName() {
      return EVENT_SOURCE_NAME;
    },
    getHookEvents() {
      return [
        "repo:commit_comment_created",
      ];
    },
    getHookPathProps() {
      return {
        workspaceId: this.workspaceId,
        repositoryId: this.repositoryId,
      };
    },
    generateMeta(data) {
      const { headers, body } = data;
      const { comment, commit } = body;
      const summary = `New comment on commit ${commit.hash}`;
      const ts = +new Date(headers["x-event-time"]);
      return {
        id: comment.id,
        summary,
        ts,
      };
    },
  },
};
