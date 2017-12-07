const bcrypt = require('bcrypt');
const kx = require("../db/connection");
const moment = require('moment');

const UsersController = {
  new(req, res, next) {
    res.render("users/new");
  },

  async show(req, res, next) {
    const { id } = req.params
    const { currentUser } = req

    try {

      const attendees = await kx
        .select("events.*")
        .from("attendees")
        .innerJoin("events", "attendees.event_id", "events.id")
        .where({ user_id: id });

      const users = await kx
      .first("users.*")
      .from("users")
      .where({"users.id": id})
      .then(users => res.render("users/show", { users, attendees, moment}))
    } catch (error) {
      next(error);
    }
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
},
edit(req, res, next) {
  const { id } = req.params;

  kx
    .first()
    .from("users")
    .where({ id })
    .then(users => res.render("users/edit", { users }))
    .catch(error => next(error));
},
update(req, res, next) {

  const { id } = req.params;
  const { first_name, last_name, about, email } = req.body;
  const users = { first_name, last_name, email, about };
console.log('users:', users)
console.log('body', req.body)
console.log('params', req.params)
  if (req.file) {
    const { filename } = req.file;
    users.photo_path = `/uploads/${filename}`;
  }

  kx("users")
    .update(users)
    .where({ id })
    .then(() => res.redirect(`/users/${id}`))
    .catch(error => next(error));
}
};
module.exports = UsersController;
