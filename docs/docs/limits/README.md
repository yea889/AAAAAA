---
prev: false
next: false
---

# Limits

Currently, [Pipedream is free](/pricing/) for all users, subject to the technical limits noted below.

**These limits are subject to change at any time**.

[[toc]]

## Number of Workflows

**You can run an unlimited number of workflows**, as long as each operates under the limits below.

## Number of Event Sources

**You can run an unlimited number of event sources**, as long as each operates under the limits below.

## HTTP Triggers

The following limits apply to [HTTP triggers](/workflows/steps/triggers/#http).

### HTTP Request Body Size

**The body of HTTP requests sent to a source is limited to `{{$site.themeConfig.PAYLOAD_SIZE_LIMIT}}`**.

Your endpoint will issue a `413 Payload Too Large` status code when the body of your request exceeds `{{$site.themeConfig.PAYLOAD_SIZE_LIMIT}}`.

This limit **does not** apply to files uploaded as part of a `multipart/form-data` request - **you can upload files of any size in a form request and access them within your workflow**. See the docs on [Large File Support](/workflows/steps/triggers/#large-file-support) for more information.

This limit cannot be raised.

### QPS (Queries Per Second)

Generally the rate of HTTP requests sent to an endpoint is quantified by QPS, or _queries per second_. A query in this context refers to an HTTP request.

**You can send an average of 10 requests per second to your HTTP trigger**. Any requests that exceed that threshold may trigger rate limiting. If you're rate limited, we'll return a `429 Too Many Requests` response. If you control the application sending requests, you should retry the request with [exponential backoff](https://cloud.google.com/storage/docs/exponential-backoff) or a similar technique.

Generally, we'll also accept short bursts of traffic, as long as you remain around an average of 10 QPS (e.g. sending a batch of 50 requests every 30 seconds should not trigger rate limiting).

**This limit can be raised**. [Reach out to our team](/support/) to request an increase.

## Email Triggers

Currently, most of the [limits that apply to HTTP triggers](#http-triggers) also apply to [email triggers](/workflows/steps/triggers/#email).

The only limit that differs between email and HTTP triggers is the payload size: the body of HTTP requests is limited to `{{$site.themeConfig.PAYLOAD_SIZE_LIMIT}}`, where **the total size of an email sent to a workflow - its body, headers, and attachments - is limited to `{{$site.themeConfig.EMAIL_PAYLOAD_SIZE_LIMIT}}`**.

This limit cannot be raised.

## Execution time per day

**Users on the free tier have a total execution quota of 30 minutes (1,800,000 milliseconds) per day across all workflows and event sources.**

You can view your current quota usage in your [Settings](https://pipedream.com/settings/billing).

Your quota is reset, daily, at 00:00 (midnight) UTC.

Pipedream records a minimum of `100ms` per execution. For example, if your workflow runs for `50ms`, you'll incur `100ms` of time towards your daily quota.

You'll receive an email when you exhaust 80% and 100% of your daily quota. Again, this quota will be reset every day at 00:00 UTC.

**This limit can be raised**. [Reach out to our team](/support/) to request an increase.

## Memory

**You should expect to have access to at least `192 MB` of memory for your code and libraries** during workflow or event source execution.

If this quota isn't sufficient for you use case, [reach out to our team](/support/) so we can learn more.

## Disk

Your code, or a third party library, may need access to disk during the execution of your workflow or event source. **You have access to `512 MB` of disk in the `/tmp` directory**.

This limit cannot be raised.

## Workflows

### Time per execution

Every event sent to a workflow triggers a new execution of that workflow. Workflows have a default execution limit that varies with the trigger type:

- HTTP and Email-triggered workflows default to **30 seconds** per execution.
- Cron-triggered workflows default to **60 seconds** per execution.

If your code exceeds your workflow-level limit, we'll throw a **Timeout** error and stop your workflow. Any partial logs and observability associated with code cells that ran successfully before the timeout will be attached to the event in the UI, so you can examine the state of your workflow and troubleshoot where it may have failed.

**You can change this default timeout in your [workflow's settings](/workflows/settings/), up to 300 seconds (5 minutes), or down to 1 second**.

Events that trigger a **Timeout** error will appear in red in the [Inspector](/workflows/events/inspect/). You'll see the timeout error, also in red, in the cell at which the code timed out.

If you need to run a workflow that exceeds 5 minutes, please [reach out to our team](/support/).

### Event / Execution History

The [Inspector](/workflows/events/inspect/#the-inspector) shows the execution history for a given workflow. There are two limits that impact this history:

- You can view the last {{$site.themeConfig.INSPECTOR_EVENT_LIMIT}} events sent to your workflow. Sending events over this limit removes the oldest event in the history from Pipedream's system.
- The execution details for a specific run also expires after {{$site.themeConfig.INSPECTOR_EVENT_EXPIRY_DAYS}} days. So if a workflow was triggered once a day, you’d only see a rolling history of {{$site.themeConfig.INSPECTOR_EVENT_EXPIRY_DAYS}} executions.

If you'd like to store execution or error history for a longer period, consider sending execution data to a table in the [SQL Service](/destinations/sql/), an [Amazon S3 bucket](/destinations/s3/), or another external data store.

### Logs, Step Exports, and other observability

The total size of `console.log()` statements, [step exports](/workflows/steps/#step-exports), and the original event data sent to the workflow cannot exceed a combined size of `{{$site.themeConfig.FUNCTION_PAYLOAD_LIMIT}}`. If you produce logs or step exports larger than this - for example, passing around large API responses, CSVs, or other data - you may encounter a **Function Payload Limit Exceeded** in your workflow.

This limit cannot be raised.

## Acceptable Use

We ask that you abide by our [Acceptable Use](https://pipedream.com/terms/#b-acceptable-use) policy. In short this means: don't use Pipedream to break the law; don't abuse the platform; and don't use the platform to harm others.

<Footer />
