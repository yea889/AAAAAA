import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-create-tweet",
  name: "Create Tweet",
  description: "Create a new tweet. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-update)",
  version: "0.0.2",
  type: "action",
  props: {
    twitter,
    filePath: {
      type: "string",
      description: "The path within `/tmp` to find the file to upload to Twitter. Use the [`/tmp`](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/) directory to download files to.",
      placeholder: "/tmp/photo.png"
    },
  },
  async run({ $ }) {
      //
      // post a tweet with media
      //
      var b64content = fs.readFileSync('/path/to/img', { encoding: 'base64' })
      
      // first we must post the media to Twitter
      await T.post('media/upload', { media_data: b64content }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        var mediaIdStr = data.media_id_string
        var altText = "Small flowers in a planter on a sunny balcony, blossoming."
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
      
        T.post('media/metadata/create', meta_params, function (err, data, response) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }
      
            T.post('statuses/update', params, function (err, data, response) {
              console.log(data)
            })
          }
        })
      });
    const res = await this.twitter.uploadMedia({
      $,
      {

      },
    });
    $.export("$summary", "Successfully posted tweet");
    return res;
  },
};
