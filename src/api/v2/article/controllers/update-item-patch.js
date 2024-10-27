const articleService = require("../../../../lib/article");

const updateItemPatch = async (req, res, next) => {
  console.log("body", req.body);

  try {
    const article = await articleService.updateArticleV2(
      req.params.id,
      req.body
    );
    req.body;

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

module.exports = updateItemPatch;
