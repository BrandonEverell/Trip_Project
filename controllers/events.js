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
    const { currentUser} = req;

    try {
      const event = await kx
        .first("events.*")
        .from("events")
        .innerJoin("users", "events.creator_id", "users.id")
        .where({ "events.id": id });

      const attendees = await kx
        .select("users.*")
        .from("attendees")
        .innerJoin("users", "attendees.user_id","users.id")
        .where({ event_id: id })

        const posts = await kx
          .first("posts.*")
          .from("posts")
          .innerJoin("users", "posts.user_id", "users.id")
          .where({ "posts.id": id });

      res.render("events/show", { event, attendees, posts });
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
  },

  async joinGroup(req, res, next) {
    const { currentUser} = req;
    const { id } = req.params

    try {
      await kx

        .insert({ user_id: currentUser.id, event_id: id })
        .into("attendees");

      const event = await kx
        .first("events.*")
        .from("events")
        .innerJoin("users", "events.creator_id", "users.id")
        .where({ "events.id": id });

        const attendees = await kx
          .select("users.*")
          .from("attendees")
          .innerJoin("users", "attendees.user_id","users.id")
          .where({ event_id: id })

          const posts = await kx // SET UP THIS QUERY
            .first("posts.*")
            .from("posts")
            .innerJoin("users", "posts.user_id", "users.id")
            .where({ "posts.id": id });


      res.render('events/show', { event, attendees, posts });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = EventsController;
