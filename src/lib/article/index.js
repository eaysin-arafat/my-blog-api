const { Article } = require("../../model");
const { notFound } = require("../../utils/error");
const updateArticleV2 = require("./update-article-v2");
const defaults = require("../../config/defaults");
/**
 * Find all articles
 * pagination
 * searching
 * sorting
 * @param {*} param0
 * @returns
 */
const findAll = async ({
  page = defaults.page,
  limit = defaults.limit,
  sortType = defaults.sortType,
  sortBy = defaults.sortBy,
  search = defaults.search,
}) => {
  const sortString = `${sortType === "dsc" ? "-" : ""}${sortBy}`;

  const filter = {
    title: { $regex: search, $options: "i" },
  };

  const articles = await Article.find(filter)
    .populate({ path: "author", select: "name" })
    .sort(sortString)
    .skip(page * limit - limit)
    .limit(limit);

  return articles?.map((article) => ({
    ...article._doc,
    id: article.id,
  }));
};

/**
 * count all article
 * @param {*} param0
 * @returns
 */
const count = ({ search = "" }) => {
  const filter = {
    title: { $regex: search, $options: "i" },
  };

  return Article.countDocuments(filter);
};

/**
 * create a new article
 * @param {*} param0
 * @returns
 */
const create = async ({
  title,
  body = "",
  cover = "",
  status = "draft",
  author,
}) => {
  if (!title || !author) {
    const error = new Error("Invalid parameters");
    error.status = 400;
    throw error;
  }

  const article = new Article({
    title,
    body,
    cover,
    status,
    author: author.id,
  });

  await article.save();

  return {
    ...article._doc,
    id: article.id,
  };
};

/**
 * Find a single article
 * @param {*} param0
 * @returns
 */
const findSingleItems = async ({ id, expand = "" }) => {
  if (!id) throw new Error("Id is required");

  expand = expand.split(",").map((item) => item.trim());

  const article = await Article.findById(id);
  if (!article) throw notFound();

  if (expand.includes("author")) {
    await article.populate({
      path: "author",
      select: "name",
      strictPopulate: false,
    });
  }

  if (expand.includes("comment")) {
    await article.populate({
      path: "comments",
      strictPopulate: false,
    });
  }

  return {
    ...article._doc,
    id: article.id,
  };
};

/**
 * update or create article
 * @param {*} id
 * @param {*} param1
 * @returns
 */
const updateOrCreate = async (
  id,
  { title, body, author, cover = "", status = "draft" }
) => {
  const article = await Article.findById(id);

  if (!article) {
    const article = await create({ title, body, cover, status, author });
    return {
      article,
      code: 201,
    };
  }

  const payload = {
    title,
    body,
    cover,
    status,
    author: author.id,
  };

  article.overwrite(payload);
  await article.save();

  return { article: { ...article._doc, id: article.id }, code: 200 };
};

/**
 * update article properties
 * @param {*} id
 * @param {*} param1
 * @returns
 */
const updateProperties = async (id, { title, body, cover, status }) => {
  const article = await Article.findById(id);
  if (!article) throw notFound();

  const payload = { title, body, cover, status };

  Object.keys(payload).forEach((key) => {
    article[key] = payload[key] ?? article[key];
  });

  await article.save();

  return {
    ...article._doc,
    id: article.id,
  };
};

/**
 * delete article and associated all data
 * @param {*} id
 * @returns
 */
const removeItem = async (id) => {
  const article = await Article.findById(id);
  if (!article) throw notFound();

  // TODO:
  // Asynchronously Delete all associated comments
  // Comment.deleteMany({article: id})

  return Article.findByIdAndDelete(id);
};

const checkOwnership = async ({ resourceId, userId }) => {
  console.log("resourceId", resourceId);

  const article = await Article.findById(resourceId);
  if (!article) throw notFound();

  console.log("article._doc.author", article);

  if (article._doc.author.toString() === userId) return true;

  return false;
};

module.exports = {
  findAll,
  findSingleItems,
  create,
  count,
  updateOrCreate,
  updateProperties,
  removeItem,
  checkOwnership,
  updateArticleV2,
};
