const authService = require("../../../../lib/auth");
const { generateToken } = require("../../../../lib/token");

const resister = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await authService.register({ name, email, password });

    // generate access token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateToken({ payload });

    // response
    const response = {
      code: 201,
      message: "Login successful",
      data: {
        access_token: accessToken,
      },
      links: {
        self: "/auth/register",
        login: "/auth/login",
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = resister;
