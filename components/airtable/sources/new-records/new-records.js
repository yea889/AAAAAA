const airtable = require('../../airtable.app.js')
const moment = require('moment')
const axios = require('axios')

module.exports = {
  name: "New Records",
  description: "Emit an event for each new record in a table",
  key: "airtable-new-records",
  version: "0.0.2",
  props: {
    db: "$.service.db",
    airtable,
    baseId: { type: "$.airtable.baseId", appProp: "airtable" },
    tableId: { type: "$.airtable.tableId", baseIdProp: "baseId" },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  async run(event) {
    const config = {
      url: `https://api.airtable.com/v0/${encodeURIComponent(this.baseId)}/${encodeURIComponent(this.tableId)}`,
      params: {},
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
    }

    let maxTimestamp
    const lastMaxTimestamp = this.db.get("lastMaxTimestamp")
    if (lastMaxTimestamp) {
      config.params.filterByFormula = `CREATED_TIME() > "${lastMaxTimestamp}"`
      maxTimestamp = lastMaxTimestamp
    }

    const { data } = await axios(config)

    if (!data.records.length) {
      console.log(`No new records.`)
      return
    }

    const { baseId, tableId, viewId } = this
    const metadata = {
      baseId,
      tableId,
      viewId
    }

    let recordCount = 0
    for (let record of data.records) {
      record.metadata = metadata

      this.$emit(record, {
        ts: moment(record.createdTime).valueOf(),
        summary: JSON.stringify(record.fields),
        id: record.id,
      })
      if (!maxTimestamp || moment(record.createdTime).valueOf() > moment(maxTimestamp).valueOf()) {
        maxTimestamp = record.createdTime
      }
      recordCount++
    }
    console.log(`Emitted ${recordCount} new records(s).`)
    this.db.set("lastMaxTimestamp", maxTimestamp)
  },
}
