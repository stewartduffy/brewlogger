require("dotenv").config();
const { google } = require("googleapis");
const axios = require("axios");

const init = async () => {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    keyFilename: "./credentials.json"
  });

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: "1dRau2UdMHiqDWgrnJ6IPyBUkHlowrVXNVAuA-ShtS4k",
      range: "C2:G2"
    });

    const rows = data.values;
    const payload = constructPayload(rows);
    postReadings(payload);
  } catch (err) {
    console.log("The API returned an error: " + err);
    console.error(err);
  }
};

function constructPayload(rows) {
  const temp = rows[0][2];
  const gravity = rows[0][1];
  const beer = rows[0][4];

  return {
    temp,
    gravity,
    beer,
    name: "Brewlogger",
    temp_unit: "C",
    gravity_unit: "G",
    comment: "Hello World"
  };
}

async function postReadings(payload) {
  const BREWFATHER_STREAM_ID = process.env.BREWFATHER_STREAM_ID;
  const BREWFATHER_ENDPOINT = `http://log.brewfather.net/stream?id=${BREWFATHER_STREAM_ID}`;

  try {
    const { data } = await axios.post(BREWFATHER_ENDPOINT, payload);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

init();
