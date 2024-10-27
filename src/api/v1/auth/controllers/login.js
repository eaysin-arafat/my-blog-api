const authService = require("../../../../lib/auth");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const accessToken = await authService.login({ email, password });

    // response
    const response = {
      code: 201,
      message: "Login successful",
      data: {
        access_token: accessToken,
      },
      links: {
        self: "/auth/login",
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = login;
