require("dotenv").config();

const { auth } = require("express-oauth2-jwt-bearer");

const API = process.env.AUTH0_CLIENT_API;
const BASEURL = process.env.AUTH0_CLIENT_BASEURL;

if (!API || !BASEURL) {
  throw new Error(
    "❌ Missing AUTH0_CLIENT_API or AUTH0_CLIENT_BASEURL in environment variables"
  );
}

const verifyToken = auth({
  audience: API,
  issuerBaseURL: BASEURL,
  tokenSigningAlg: "RS256",
  onError: (err, req, res, next) => {
    console.error("❌ JWT Verification Failed:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  },
});

module.exports = verifyToken;
