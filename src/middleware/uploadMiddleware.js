const uploader = require("../utils/uploader");

const uploadMiddleware = (directory, fields) => {
  const upload = uploader(directory);

  return upload.fields(fields);
};

module.exports = uploadMiddleware;
