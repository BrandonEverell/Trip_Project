const bcrypt = require('bcrypt');
const kx = require("../db/connection");

const UsersController = {
  new(req, res, next) {
    res.render("users/new");
  },
  async create(req, res, next) {
    const {first_name, last_name, email, password, confirmPassword} = req.body;

    if (password !== confirmPassword) {
      req.flash("danger", "Password and password confirmation do not match");
      console.log("password", password)
      console.log("confirmPassword", confirmPassword)
      return res.redirect("/users/new");
    }

    try {
      const passwordDigest = await bcrypt.hash(password, 10);
      console.log("$#$#$#$#$#$#$#$", passwordDigest)

      const [user] = await kx
        .insert({ first_name, last_name, email, passwordDigest })
        .into("users")
        .returning("*");

      if (user) {
        req.session.userId = user.id;
        req.flash("success", "Thank you for signing up!");
        res.redirect("/");
      } else {
        req.flash("danger", "Something went wrong");
        res.redirect("/users/new");
      }
    } catch (error) {
      next(error);
    }
  }
};
module.exports = UsersController;
