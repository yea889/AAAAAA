export default {
  type: "app",
  app: "agendor",
  propDefinitions: {},
  methods: {
    _getAxiosParams(opts) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    _getBaseUrl() {
      return "https://api.agendor.com.br/v3/";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    // this.$auth contains connected account data
    authKeys() {
      console.log(this.$auth);
    },
  },
};
