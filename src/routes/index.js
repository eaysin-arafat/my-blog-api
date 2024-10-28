const router = require("express").Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const ownership = require("../middleware/ownership");
const { controllers: articleController } = require("../api/v1/article");
const { controllers: articleControllerV2 } = require("../api/v2/article");
const { controllers: authController } = require("../api/v1/auth");

// Auth routes
router
  .post("/api/v1/auth/register", authController.register)
  .post("/api/v1/auth/login", authController.login);

// Article Routes
// V1
router
  .route("/api/v1/articles")
  .get(articleController.findAllItems)
  .post(authenticate, authorize(["admin", "user"]), articleController.create);

router
  .route("/api/v1/articles/:id")
  .get(articleController.findSingleItem)
  .put(authenticate, ownership("Article"), articleController.updateItem)
  .patch(authenticate, ownership("Article"), articleController.updateItemPatch)
  .delete(
    authenticate,
    authorize(["admin", "user"]),
    ownership("Article"),
    articleController.removeItem
  );

// V2
router
  .route("/api/v2/articles/:id")
  .patch(
    authenticate,
    ownership("Article"),
    articleControllerV2.updateItemPatch
  );

module.exports = router;
