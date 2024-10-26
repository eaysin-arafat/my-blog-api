const articleService = require("../../../../lib/article");

const findSingleItem = async (req, res, next) => {
  const id = req.params.id;
  const expand = req.query.expand || "";

  try {
    const article = await articleService.findSingleItems({ id, expand });

    const response = {
      data: article,
      links: {
        self: `/articles/${article.id}`,
        author: `articles/${article.id}/author`,
        comments: `articles/${article.id}/comments`,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = findSingleItem;
