const fs = require("fs");
const Joi = require("@hapi/joi");

// {
//   id: "uuid",
//   text: "",
//   completed: boolean
// }

// use Joi to create a data schema
const schema = Joi.object({
  // each key has a datatype and constraints
  id: Joi.string().uuid(),
  text: Joi.string()
    .min(1)
    .required(),
  completed: Joi.boolean(),
});

const readFile = (filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else if (data) {
        resolve(JSON.parse(data));
      } else {
        reject(new Error("No data found."));
      }
    });
  });

const writeFile = (filePath, data) => {
  // make sure our data is stringified
  if (typeof data !== "string") {
    data = JSON.stringify(data);
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  schema,
  readFile,
  writeFile,
};
