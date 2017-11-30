const kx = require("../db/connection");

const EventsController = {
  index(req, res, next) {
    kx
      .select("events.*")
      .from("events")
      .innerJoin("users", "events.creator_id", "users.id")
      .orderBy("events.created_at", "DESC")
      .then(events => res.render("events/index", { events }));
  },

  async show(req, res, next) {
    const { id } = req.params;

    try {
      const event = await kx
        .first("events.*")
        .from("events")
        .innerJoin("users", "events.creator_id", "users.id")
        .where({ "events.id": id });

      res.render("events/show", { event });
    } catch (error) {
      next(error);
    }
  },
  new(req, res, next) {
    res.render("posts/new");
  },

  new(req, res, next) {
    res.render("events/new");
  },

  create(req, res, next) {
    const { title, date } = req.body;
    const { currentUser } = req;
    kx
      .insert({ creator_id: currentUser.id, title: title, date: date })
      .into("events")
      .then(() => {
        req.flash("Success", "Event Created!");
        res.redirect("/events");
      });
  }
};

module.exports = EventsController;
