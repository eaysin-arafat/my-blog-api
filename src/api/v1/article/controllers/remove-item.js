const articleService = require("../../../../lib/article");

const removeItem = async (req, res, next) => {
  const { id } = req.params;

  try {
    await articleService.removeItem(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = removeItem;
