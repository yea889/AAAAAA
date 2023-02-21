const axios = require('axios')
const querystring = require('querystring')
const moment = require('moment')

module.exports = {
  type: "app",
  app: "twitter",
  propDefinitions: {
    q: {
      type: "string",
      label: 'Search Term',
      description: "Search for keywords `star wars`, screen names `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
    },
    keyword_filter: {
      type: "string",
      label: 'Keywords',
      description: "Filter tweets based on keywords `star wars`, user mentions `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
      optional: true,
    },
    result_type: {
      type: "string",
      label: "Result Type",
      description: `Specifies the type of results you want to retrieve.`,
      optional: true,
      options: [
        { label: "Recent", value: "recent" },
        { label: "Popular", value: "popular" },
        { label: "Mixed", value: "mixed" },
      ],
      default: 'recent',
    },
    count: {
      type: "integer",
      min: 1,
      max: 100,
      label: "Count (advanced)",
      description: "The maximum number of tweets to return per API request (up to `100`)",
      optional: true,
      default: 100,
    },
    maxRequests: {
      type: "integer",
      min: 1,
      max: 180,
      label: "Max API Requests per Execution (advanced)",
      description: "The maximum number of API requests to make per execution (e.g., multiple requests are required to retrieve paginated results). **Note:** Twitter [rate limits API requests](https://developer.twitter.com/en/docs/basics/rate-limiting) per 15 minute interval.",
      optional: true,
      default: 1,
    },
    from: {
      type: "string",
      label: "From",
      description: "The screen name of the user (e.g., `pipedream`)",
    },
    geocode: {
      type: "string",
      label: "Geocode",
      description: "Returns tweets by users located within a given radius of the given latitude/longitude. The location is preferentially taking from the Geotagging API, but will fall back to their Twitter profile. The parameter value is specified by `latitude,longitude,radius`, where radius units must be specified as either `mi` (miles) or `km` (kilometers). Note that you cannot use the near operator via the API to geocode arbitrary locations; however you can use this geocode parameter to search near geocodes directly.",
      optional: true,
    },
    includeRetweets: {
      type: "string",
      label: "Retweets",
      description: "Select whether to `include`, `exclude` or `only` include retweets in emitted events.",
      optional: true,
      options: [
        { label: "Include", value: "include" },
        { label: "Exclude", value: "exclude" },
        { label: "Only include retweets", value: "only" },
      ],
      default: "include",
    },
    includeReplies: {
      type: "string",
      label: "Replies",
      description: "Select whether to `include`, `exclude` or `only` include replies in emitted events.",
      optional: true,
      options: [
        { label: "Include", value: "include" },
        { label: "Exclude", value: "exclude" },
        { label: "Only include replies", value: "only" },
      ],
      default: "include",
    },
    enrichTweets: {
      type: "boolean",
      label: "Enrich Tweets",
      description: "Enrich each tweet with epoch (milliseconds) and ISO8601 conversions of Twitter's `created_at` timestamp.",
      optional: true,
      default: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Specify the language of the query you are sending (only `ja` is currently effective). This is intended for language-specific consumers and the default should work in the majority of cases.",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Language",
      description: "Restricts tweets to the given language. Language detection is best-effort.",
      optional: true,
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return {
            options: [],
          };
        }

        const isoLanguages = require('./sources/language-codes');
        return isoLanguages.map(isoLanguage => {
          const {
            English: language,
            alpha2: code,
          } = isoLanguage;
          return {
            label: `${language} (${code})`,
            value: code,
          };
        })
      }
    },
    screen_name: {
      type: "string",
      label: "Screen Name",
      description: "The screen name of the user (e.g., `pipedream`)"
    },
    trendLocation: {
      type: "string",
      label: "Location",
      async options(opts) {
        const trendLocations = await this.getTrendLocations()
        return trendLocations.map(location => {
          return { label: `${location.name}, ${location.countryCode} (${location.placeType.name})`, value: location.woeid }
        })
      },
    },
  },
  methods: {
    async _getAuthorizationHeader({ data, method, url }) {
      const requestData = {
        data,
        method,
        url,
      }
      const token = {
        key: this.$auth.oauth_access_token,
        secret: this.$auth.oauth_refresh_token,
      }
      return (await axios({
        method: 'POST',
        url: this.$auth.oauth_signer_uri,
        data: {
          requestData,
          token,
        }
      })).data
    },
    async _makeRequest(config, attempt = 0) {
      if (!config.headers) config.headers = {}
      if (config.params) {
        const query = querystring.stringify(config.params)
        delete config.params
        const sep = config.url.indexOf('?') === -1 ? '?' : '&'
        config.url += `${sep}${query}`
        config.url = config.url.replace('?&','?')
      }
      let authorization, count = 0
      const maxTries = 3
      while(true) {
        try {
          authorization = await this._getAuthorizationHeader(config)
          break
        } catch (err) {
          // handle exception
          if (++count == maxTries) {
            throw err
          }
          const milliseconds = 1000 * count
          await new Promise(resolve => setTimeout(resolve, milliseconds))
        }
      }
      config.headers.authorization = authorization
      return axios(config)
    },
    async getFollowers(screen_name) {
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/followers/ids.json?`,
        params: {
          screen_name,
          stringify_ids: true,
        }
      })).data.ids
    },
    async *getAllFollowers(screenName) {
      const url = `https://api.twitter.com/1.1/followers/ids.json?`;
      const baseParams = {
        screen_name: screenName,
        stringify_ids: true,
      };
      const config = {
        url,
        params: baseParams,
      };
      const { data } = await this._makeRequest(config);
      let {
        ids,
        next_cursor: nextCursor,
        previous_cursor: prevCursor,
      } = data;
      while (nextCursor !== 0 || prevCursor === 0) {
        for (const id of ids) {
          yield id;
        }

        if (nextCursor === 0) {
          return;
        }

        const params = {
          ...baseParams,
          cursor: nextCursor,
        };
        const config = {
          url,
          params,
        };
        const { data } = await this._makeRequest(config);
        ({
          ids,
          next_cursor: nextCursor,
          previous_cursor: prevCursor,
        } = data);
      }
    },
    async getLikedTweets(opts = {}) {
      const {
        screen_name,
        count = 200,
        tweet_mode = 'extended',
      } = opts
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/favorites/list.json`,
        params: {
          screen_name,
          count,
          tweet_mode,
        }
      })).data
    },
    async lookupUsers(userIdArray) {
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/users/lookup.json`,
        params: {
          user_id: userIdArray.join(),
        }
      })).data
    },
    async search(opts = {}) {
      const { q, since_id, tweet_mode, count, result_type, lang, locale, geocode, max_id } = opts
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/search/tweets.json`,
        params: {
          q,
          since_id,
          max_id,
          tweet_mode,
          count,
          result_type,
          lang,
          locale,
          geocode,
        }
      }))
    },
    async getTrendLocations() {
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/trends/available.json`,
      })).data
    },
    async getTrends(opts = {}) {
      const {
        id = 1,
      } = opts
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/trends/place.json`,
        params: {
          id,
        }
      })).data
    },
    async getUserTimeline(opts = {}) {
      const {
        screen_name,
        count = 100,
        exclude_replies,
        include_rts,
        since_id,
      } = opts

      const params = {
        screen_name,
        count,
        exclude_replies,
        include_rts,
        tweet_mode: 'extended',
      }

      if(since_id) {
        params.since_id = since_id
      }

      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/statuses/user_timeline.json`,
        method: 'get',
        params,
      })).data
    },
    async searchHelper(opts = {}) {
      const tweets = []

      const {
        tweet_mode = 'extended',
        result_type,
        count = 100,
        lang,
        locale,
        geocode,
        enrichTweets = true,
        includeReplies = true,
        includeRetweets = true,
      } = opts

      let { q, max_id, since_id } = opts
      let min_id

      if(includeReplies === 'exclude') {
        q = `${q} -filter:replies`
      } else if(includeReplies === 'only') {
        q = `${q} filter:replies`
      }

      if(includeRetweets === 'exclude') {
        q = `${q} -filter:nativeretweets`
      } else if(includeRetweets === 'only') {
        q = `${q} filter:nativeretweets`
      }

      const response = await this.search({ q, since_id, tweet_mode, count, result_type, lang, locale, geocode, max_id })

      if(!response) {
        console.log(`Last request was not successful.`)
        return {
          statusCode: "Error",
        }
      }

      for (let tweet of response.data.statuses) {
        if ((!since_id || (since_id && tweet.id_str !== since_id)) && (!max_id || (max_id && tweet.id_str !== max_id))) {
          if (enrichTweets) {
            tweet.created_at_timestamp = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf()
            tweet.created_at_iso8601 = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').toISOString()
          }
          tweets.push(tweet)
          if (!max_id || tweet.id_str > max_id) {
            max_id = tweet.id_str
            if(!min_id) {
              min_id = max_id
            }
          }
          if (tweet.id_str < max_id) {
            min_id = tweet.id_str
          }
        }
      }

      return {
        tweets,
        max_id,
        min_id,
        count,
        resultCount: response.data.statuses.length,
        statusCode: response.status,
      }
    },
    async paginatedSearch(opts = {}) {
      const {
        count = 100,
        q,
        since_id,
        lang,
        locale,
        geocode,
        result_type,
        enrichTweets,
        includeReplies,
        includeRetweets,
        limitFirstPage = true,
      } = opts

      let { max_id, maxRequests = 1 } = opts, totalRequests = 0

      const tweets = []

      if (limitFirstPage) {
        maxRequests = 1
      }

      //console.log(maxPages)

      for (let request = 0; request < maxRequests; request++) {
        const response = await this.searchHelper({
          count,
          q,
          since_id,
          max_id,
          lang,
          locale,
          geocode,
          result_type,
          enrichTweets,
          includeReplies,
          includeRetweets,
        })

        // increment the count of requests to report out after all requests are complete
        totalRequests++

        if (!response) {
          break
        }

        tweets.push(...response.tweets)

        //console.log(`resultCount: ${response.resultCount} count: ${response.count}`)

        if (since_id && totalRequests === maxRequests && response.resultCount === response.count) {
          console.log(`The last API request returned the maximum number of results. There may be additional tweets matching your search criteria. To return more tweets, increase the maximum number of API requests per execution.`)
        }

        if (response.length === 0 || response.resultCount < response.count) {
          break
        }
        max_id = response.min_id
      }

      console.log(`Made ${totalRequests} requests to the Twitter API and returned ${tweets.length} tweets.`)

      return tweets
    },
    async verifyCredentials() {
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/account/verify_credentials.json`,
      })).data
    },
    webhooks: {
      // TODO
    },
  },
}
