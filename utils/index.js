// ** Checks if an object is empty (returns boolean)
const isObjEmpty = (obj) => {
  return Object?.keys(obj).length === 0;
};

const jsonFormat = (obj) => {
  const object = JSON.parse(JSON.stringify(obj));
  return object;
};

module.exports = { isObjEmpty, jsonFormat };
