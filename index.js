const sheets = require("./sheets");

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.brewlogger = async (req, res) => {
  const message = await sheets.main();
  res.status(200).send(message);
};
