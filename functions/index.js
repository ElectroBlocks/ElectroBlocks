const functions = require("firebase-functions");
const { sapper } = require("./__sapper__/build/server/server");
const middleware = sapper.middleware();

exports.ssr = functions.https.onRequest((req, res) => {
  req.baseUrl = "";
  middleware(req, res);
});
