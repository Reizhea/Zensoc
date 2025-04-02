const axios = require('axios');

const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

exports.fetchFacebookMessages = async () => {
  const url = `https://graph.facebook.com/v18.0/me/conversations?fields=messages{message,from,created_time}&access_token=${PAGE_ACCESS_TOKEN}`;
  
  const response = await axios.get(url);
  return response.data;
};
