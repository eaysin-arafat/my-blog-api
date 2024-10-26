const defaults = require("../config/defaults");
const { generateQueryString } = require("./qs");

const getPagination = ({
  page = defaults.page,
  limit = defaults.limit,
  totalItems = defaults.totalItems,
}) => {
  const totalPage = Math.ceil(totalItems / limit);

  const pagination = {
    page,
    limit,
    totalItems,
    totalPage,
  };

  if (page < totalPage) pagination.next = page + 1;
  if (page > 1) pagination.prev = page - 1;

  return pagination;
};

const getHATEOSForAllItems = ({
  url = "/",
  path = "",
  query = {},
  hasNext = false,
  hasPrev = false,
  page = 1,
}) => {
  const links = {
    self: url,
  };

  if (hasNext) {
    const queryString = generateQueryString({ ...query, page: page + 1 });
    links.next = `${path}?${queryString}`;
  }
  if (hasPrev) {
    const queryString = generateQueryString({ ...query, page: page - 1 });
    links.prev = `${path}?${queryString}`;
  }

  return links;
};

const getTransformedItems = ({ items = [], selection = [], path = "/" }) => {
  if (!Array.isArray(items) || !Array.isArray(selection)) {
    throw new Error("Invalid Arguments");
  }

  if (selection.length === 0) {
    return items.map((item) => ({ ...item, link: `${path}/${item?.id}` }));
  }

  return items.map((item) => {
    const result = {};

    selection.forEach((key) => {
      result[key] = item[key];
    });

    result.link = `${path}/${item?.id}`;
    return result;
  });
};

module.exports = { getPagination, getHATEOSForAllItems, getTransformedItems };
