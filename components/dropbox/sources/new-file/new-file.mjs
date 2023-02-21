import common from "../common.mjs";

export default {
  ...common,
  dedupe: "unique",
  type: "source",
  key: "dropbox-new-file",
  name: "New File",
  version: "0.0.7",
  description: "Emit new event when a new file is added to your account or a specific folder. Make sure the number of files/folders in the watched folder does not exceed 4000.",
  props: {
    ...common.props,
    includeMediaInfo: {
      label: "Include Media Info",
      type: "boolean",
      description: "Emit media info for photos and videos (incurs an additional API call)",
      default: false,
    },
    includeLink: {
      label: "Include Link",
      type: "boolean",
      description: "Emit temporary download link to file (incurs an additional API call)",
      default: false,
    },
  },
  hooks: {
    async activate() {
      const startTime = new Date();
      await this.dropbox.initState(this);
      this._setLastFileModTime(startTime);
    },
  },
  methods: {
    ...common.methods,
    _setLastFileModTime(time) {
      this.db.set("last_file_mod_time", time);
    },
    _getLastFileModTime() {
      return this.db.get("last_file_mod_time");
    },
  },
  async run() {
    const lastFileModTime = this._getLastFileModTime();
    let currFileModTime = "";
    const updates = await this.dropbox.getUpdates(this);
    for (let update of updates) {
      let file = {
        ...update,
      };
      if (update[".tag"] !== "file") {
        continue;
      }
      if (update.server_modified > currFileModTime) {
        currFileModTime = update.server_modified;
      }
      const isNewFile = await this.isNewFile(update, lastFileModTime);
      if (!isNewFile) {
        continue;
      }
      if (this.includeMediaInfo) {
        file = await this.getMediaInfo(update);
      }
      if (this.includeLink) {
        file.link = await this.getTemporaryLink(update);
      }
      this.$emit(file, this.getMeta(file.id, file.path_display || file.id));
    }
    if (currFileModTime != "") {
      this._setLastFileModTime(currFileModTime);
    }
  },
};
