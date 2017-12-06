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
    const { currentUser } = req;

    try {
      const event = await kx
        .first("events.*")
        .from("events")
        .innerJoin("users", "events.creator_id", "users.id")
        .where({ "events.id": id });

      const attendees = await kx
        .select("users.*")
        .from("attendees")
        .innerJoin("users", "attendees.user_id", "users.id")
        .where({ event_id: id });

      const posts = await kx
        .select("posts.*")
        .from("posts")
        .innerJoin("events", "posts.event_id", "events.id")
        .innerJoin("users", "posts.user_id", "users.id")
        .orderBy("posts.created_at", "DESC")
        .where({ 'events.id': id })

        .then(posts => res.render("events/show", { event, attendees, posts }))


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
    const { title, date, description } = req.body;
    const { currentUser } = req;
    kx
      .insert({ creator_id: currentUser.id, title: title, date: date, description: description })
      .into("events")
      .then(() => {
        req.flash("Success", "Event Created!");
        res.redirect("/events");
      });
  },

  async joinGroup(req, res, next) {
    const { currentUser } = req;
    const { id } = req.params;

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
        .innerJoin("users", "attendees.user_id", "users.id")
        .where({ event_id: id });

        const posts = await kx
          .select("posts.*")
          .from("posts")
          .innerJoin("events", "posts.event_id", "events.id")
          .innerJoin("users", "posts.user_id", "users.id")
          .where({ 'events.id': id })
          .then(posts => res.render("events/show", { event, attendees, posts }))


    } catch (error) {
      next(error);
    }
  },

  async newPost(req, res, next) {
    const {id} = req.params;

    try {
      await kx

      const event = await kx
        .first("events.*")
        .from("events")
        .innerJoin("users", "events.creator_id", "users.id")
        .where({ "events.id": id });

      res.render(`events/newPost`, {event});
    } catch (error) {
      next(error);
    }
  },
  createPost(req, res, next) {
    const { title, content } = req.body;
    const { currentUser } = req;
    const { id } = req.params


    if (req.files === undefined) {
      console.log("Only text here");
      kx
        .insert({ user_id: currentUser.id, title: title, content: content, event_id: id })
        .into("posts")
        .then(() => {
          // req.flash("success", "Post Created!");
          res.redirect(`/events/${id}`);
        });
    } else {
  

      const insertPromiseArray = req.files.map(file => {
        return kx
          .insert({
            user_id: currentUser.id,
            title: title,
            content: content,
            event_id: id,
            photo_path: `/uploads/${file.filename}`
          })
          .into("posts");
      });
      Promise.all(insertPromiseArray).then(() => {
         req.flash("success", "Post Created!");
         console.log(`/events/${id}`)
        res.redirect(`/events/${id}`);
      })
    }
  }
};

module.exports = EventsController;
