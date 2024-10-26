const deepMerge = require("./deep-merge");

const transformData = ({
  data = {},
  excludeProperties = [],
  includeProperties = [],
  additionalProperties = {},
} = {}) => {
  // Validate inputs
  if (typeof data !== "object" || Array.isArray(data)) {
    console.error("Expected 'Data' to be an object");
    return {};
  }
  if (!Array.isArray(excludeProperties) || !Array.isArray(includeProperties)) {
    console.error(
      "'excludeProperties' and 'includeProperties' should be arrays"
    );
    return {};
  }
  if (
    typeof additionalProperties !== "object" ||
    Array.isArray(additionalProperties)
  ) {
    console.error("'additionalProperties' should be an object");
    return {};
  }

  // Deep copy data to avoid mutating the original object
  let transformedData = JSON.parse(JSON.stringify(data));

  // Include only specified properties if includeProperties is provided
  if (includeProperties.length > 0) {
    transformedData = includeProperties.reduce((acc, key) => {
      if (key in transformedData) {
        acc[key] = transformedData[key];
      }
      return acc;
    }, {});
  }

  // Remove specified properties
  excludeProperties.forEach((property) => {
    delete transformedData[property];
  });

  // Deep merge additionalProperties into transformedData
  transformedData = deepMerge(transformedData, additionalProperties);

  return transformedData;
};

module.exports = transformData;
