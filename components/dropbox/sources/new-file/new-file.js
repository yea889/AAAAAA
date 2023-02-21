const dropbox = require('../../dropbox.app.js')

module.exports = {
  key: "dropbox-new-file",
  name: "New File",
  version: "0.0.1",
  description: "Emits an event when a new file is added to your account or a specific folder. Make sure the number of files/folders in the watched folder does not exceed 4000.",
  props: {
    dropbox,
    path: { propDefinition: [dropbox, "path"]},
    recursive: { propDefinition: [dropbox, "recursive"]},
    includeMediaInfo: {
      type: "boolean",
      description: "Emit media info for photos and videos (incurs an additional API call)",
      default: false,
    },
    includeLink: {
      type: "boolean",
      description: "Emit temporary download link to file (incurs an additional API call)",
      default: false,
    },
    dropboxApphook: {
      type: "$.interface.apphook",
      appProp: "dropbox",
      static: [],
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      let startTime = new Date()
      await this.dropbox.initState(this)
      this.db.set("last_file_mod_time", startTime)
    }
  },
  async run(event) {
    const lastFileModTime = this.db.get("last_file_mod_time")
    let currFileModTime = ""
    let updates = await this.dropbox.getUpdates(this)
    for(update of updates) {
      if (update[".tag"] == "file") {
        if (update.server_modified > currFileModTime) {
          currFileModTime = update.server_modified
        }
        try {
          let revisions = await this.dropbox.sdk().filesListRevisions({
            path: update.id,
            mode: { ".tag": "id" },
            limit: 10,
          })
          if (revisions.result) {
            revisions = revisions.result
          }
          if (revisions.entries.length > 1) {
            let oldest = revisions.entries.pop()
            if (lastFileModTime && lastFileModTime >= oldest.client_modified) {
              continue
            }
          }
          if (this.includeMediaInfo) {
            update = await this.dropbox.sdk().filesGetMetadata({
              path: update.path_lower,
              include_media_info: true,
            })
            if (update.result) {
              update = update.result
            }
          }
          if (this.includeLink) {
            let response = await this.dropbox.sdk().filesGetTemporaryLink({
              path: update.path_lower,
            })
            if (response.result) {
              response = response.result
            }
            const { link, metadata } = response
            update.link = link
          }
        } catch(err) {
          console.log(err)
          throw(`Error looking up revisions for file: ${update.name}`)
        }
        this.$emit(update)
      }
    }
    if (currFileModTime != "") {
      this.db.set("last_file_mod_time", currFileModTime)
    }
  },
}
