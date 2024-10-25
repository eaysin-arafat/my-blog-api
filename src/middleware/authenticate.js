const authenticate = (req, _res, next) => {
  req.user = {
    id: "671aadf6e66aae88fe41dbaf",
    name: "Eaysin",
    email: "anamul@gmail.com",
    role: "user",
  };

  next();
};

module.exports = authenticate;
