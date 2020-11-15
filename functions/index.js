const functions = require("firebase-functions");
const { sapper } = require("./__sapper__/build/server/server");
const middleware = sapper.middleware();
const cors = require("cors")({ origin: true });

exports.ssr = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
        req.baseUrl = "";
        middleware(req, res);
    });

});
