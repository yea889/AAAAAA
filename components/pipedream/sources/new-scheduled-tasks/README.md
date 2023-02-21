# Task Scheduler

**This event source exposes an HTTP API for scheduling one-time tasks, at any timestamp, up to one year in the future. [Click here to create this source](https://pipedream.com/sources?action=create&key=pipedream-new-scheduled-tasks)**.

To [schedule a new task](#scheduling-a-task), just send an HTTP `POST` request to your source's endpoint, at the `/schedule` path, with the following format:

```javascript
{
  "timestamp": "2020-08-21T04:29:00.951Z", // timestamp: an ISO 8601 timestamp
  "message": { "name": "Luke" } // message: any object or string
}
```

When the timestamp arrives and the task is invoked, the source will emit the payload passed in your original, scheduled request. This allows you to trigger [a Pipedream workflow](https://docs.pipedream.com/workflows/) at the scheduled time, passing the `message` and `timestamp` to the workflow as an [incoming event](https://docs.pipedream.com/workflows/events/).

You can also listen for these events in your own app / infra, by [subscribing to your source's SSE stream](https://docs.pipedream.com/api/sse/). Each time a scheduled task is emitted from your Pipedream source, it also emits a message to that SSE stream. Any application (a Docker container, a Rails app, etc.) listening to that SSE stream can react to that message to run whatever code you'd like.

<!--ts-->

- [HTTP API](#http-api)
  - [Scheduling a task](#scheduling-a-task)
- [Cancelling a scheduled task](#cancelling-a-scheduled-task)
- [Processing scheduled tasks](#processing-scheduled-tasks)
- [Example: Schedule a task 30 seconds in the future](#example-schedule-a-task-30-seconds-in-the-future)

<!-- Added by: dylansather, at: Sun Sep 20 11:06:14 PDT 2020 -->

<!--te-->

## HTTP API

This source exposes an HTTP endpoint where you can send `POST` requests to schedule new tasks. Your endpoint URL should appear as the **Endpoint** in your source's details, in the **Events** tab.

### Scheduling a task

```
POST /schedule
```

To schedule a new task, `POST` a JSON object with an [ISO 8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) `timestamp` and a `message` to the **`/schedule` path** of your source's HTTP endpoint:

```javascript
{
  "timestamp": "2020-08-21T04:29:00.951Z", // timestamp: an ISO 8601 timestamp
  "message": { "name": "Luke" } // message can be any object or string
}
```

Optionally, if you configured a secret in your source, you'll need to pass that in the `x-pd-secret` header. For example:

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'x-pd-secret: 123' \
  -d '{ "timestamp": "2020-09-18T04:40:59Z", "message": "foo" }' \
  https://endpoint.m.pipedream.net/schedule
```

Successful task schedule requests yield a `200 OK` response, noting the task was successfully scheduled.

[See this workflow](https://pipedream.com/@dylburger/example-schedule-a-task-with-the-pipedream-task-scheduler-source-p_6lCqJj/edit) for an example of how to schedule new tasks.

## Cancelling a scheduled task

```
POST /cancel
```

When you schedule a task, you'll receive a unique ID assigned to that task in the `id` field of the HTTP response body. That `id` can be passed to the `/cancel` endpoint to cancel that task before its scheduled time arrives:

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'x-pd-secret: 123' \
  -d '{ "id": "8fceb45b-0241-4d04-9f3f-334679586370" }' \
  https://endpoint.m.pipedream.net/cancel
```

[See this workflow](https://pipedream.com/@dylburger/example-cancel-a-scheduled-task-with-the-pipedream-task-scheduler-source-p_o7CGnq/edit) for an example of how to cancel scheduled tasks.

## Processing scheduled tasks

Scheduled tasks are emitted by the event source as events, which you can consume with

- [Pipedream workflows](https://docs.pipedream.com/workflows/)
- [A source-specific SSE stream](https://docs.pipedream.com/api/sse/)
- [The Pipedream REST API](https://docs.pipedream.com/api/rest/)
- [The Pipedream CLI](https://docs.pipedream.com/cli/reference/#installing-the-cli)

[See the docs on consuming events from sources](https://docs.pipedream.com/event-sources/#consuming-events-from-sources) for more information.

## Example: Schedule a task 30 seconds in the future

You can use [this workflow](https://pipedream.com/@dylburger/example-schedule-a-task-with-the-pipedream-task-scheduler-source-p_6lCqJj/edit) to schedule a new task N seconds in the future:

```javascript
// N seconds from now
this.ts = new Date(+new Date() + params.numSeconds * 1000).toISOString();

const headers = {
  "Content-Type": "application/json",
};
if (params.secret) {
  headers["x-pd-secret"] = params.secret;
}

return await require("@pipedreamhq/platform").axios(this, {
  url: `${params.taskSchedulerURL}/schedule`,
  headers,
  data: {
    timestamp: this.ts,
    message: {
      name: "Luke",
      title: "Jedi",
    },
  },
});
```

Or send the same request with `cURL`:

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'x-pd-secret: 123' \
  -d '{ "timestamp": "2020-09-18T04:40:59Z", "message": "foo" }' \
  https://endpoint.m.pipedream.net/schedule
```
