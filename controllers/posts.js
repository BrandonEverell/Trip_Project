const kx = require("../db/connection");

const PostsController = {
  index(req, res, next) {
    kx
      .select("posts.*")
      .from("posts")
      .innerJoin("users", "posts.user_id", "users.id")
      .orderBy("posts.created_at", "DESC")
      .then(posts => res.render("posts/index", { posts }));
  },

  async show(req, res, next) {
    const { id } = req.params;

    try {
      const post = await kx
        .first("posts.*")
        .from("posts")
        .innerJoin("users", "posts.user_id", "users.id")
        .where({ "posts.id": id });

        const comments = await kx
        .select('comments.*', 'users.first_name as first', 'users.last_name as last', 'users.id as link')
        .from('comments')
        .innerJoin('users', 'comments.user_id', 'users.id')
        .innerJoin('posts', 'comments.post_id', 'posts.id')
        .where({post_id: id})
        .orderBy('created_at', 'DESC')


      res.render("posts/show", { post, comments });
    } catch (error) {
      next(error);
    }
  },
  new(req, res, next) {
    res.render("posts/new");
  },

  create(req, res, next) {
    const { title, content } = req.body;
    const { currentUser } = req;
    const { event_id} = req.params
    const post = { title, event_id, content, currentUser}
    console.log(post);


    if (req.files === undefined) {
      console.log("Only text here");
      kx
        .insert({ user_id: currentUser.id, title: title, content: content, event_id: event_id })
        .into("posts")
        .then(() => {
          req.flash("success", "Post Created!");
          res.redirect(`/events/${event_id}`);
        });
    } else {
      console.log("continue as normal");

      const insertPromiseArray = req.files.map(file => {
        return kx
          .insert({
            user_id: currentUser.id,
            title: title,
            content: content,
            event_id: event_id,
            photo_path: `/uploads/${file.filename}`
          })
          .into("posts");
      });
      Promise.all(insertPromiseArray).then(() => {
        req.flash("success", "Post Created!");
        res.redirect(`"/events/${event_id}`);
      });
    }
  },
  destroy(req, res, next) {
    const { id } = req.params;

    kx
      .delete()
      .from("posts")
      .where({ id })
      .then(() => res.redirect("/posts"))
      .catch(error => next(error));
  },
  edit(req, res, next) {
    const { id } = req.params;

    kx
      .first()
      .from("posts")
      .where({ id }) // <-- syntax sugar for {id: id}
      .then(post => res.render("posts/edit", { post }));
  },
  update(req, res, next) {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = { title, content };

    if (req.file) {
      const { filename } = req.file;
      post.photo_path = `/uploads/${filename}`;
    }

    kx("posts")
      .update(post)
      .where({ id })
      .then(() => res.redirect(`/posts/${id}`))
      .catch(error => next(error));
  }
};
module.exports = PostsController;
