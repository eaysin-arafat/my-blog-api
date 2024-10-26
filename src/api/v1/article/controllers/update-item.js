const articleService = require("../../../../lib/article");

const updateItem = async (req, res, next) => {
  const { id } = req.params;
  const cover = req.body.cover || "";
  const status = req.body.status || "draft";

  try {
    const { article, code } = await articleService.updateOrCreate(id, {
      title: req.body.title,
      body: req.body.body,
      author: req.user,
      cover,
      status,
    });

    const response = {
      code,
      message:
        code === 200
          ? "Article updated successfully"
          : "Article created successfully",
      data: article,
      links: {
        self: `/article/${article.id}`,
      },
    };

    res.status(code).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = updateItem;
