const kx = require('../db/connection')

const PostsController = {
  index (req, res, next) {
    console.log(req.session)
    kx
    .select('posts')
    .from('posts')
    .innerJoin('users', 'posts.user_id', 'users.id')
    .orderBy('posts.created_at', 'DESC')
    .then(posts => res.render('posts/index', {posts}))
  },

    async show(req, res, next) {
      const {id} = req.params

      try {
        const post = await kx
        .first('posts')
        .from('posts')
        .innerJoin('users', 'posts.user_id', 'users.id')
        .where({'posts.id': id})

        res.render('posts/show', {post})
      } catch (error) {
        next(error)
      }
      },
      new (req, res, next) {
        res.render('posts/new')
      },

      create(req, res, next) {
        const {title, content} = req.body;
        const {filename} = req.file;
        const {currentUser} = req;
        console.log(req.body)
        kx
    .insert({user_id: currentUser.id, title: title, content: content, photo_path: `/uploads/${filename}` })
    .into('posts')
    .then(() => {
      // When setting the type of flash message, try using alert types
      // that are available in Boostrap because we've connected together.
      // Each type will display in a different color
      req.flash('success', 'Post Created!')
      // req.flash('warning', 'Don\'t go there')
      // req.flash('danger', 'Danger! Danger, Will Robinson!')

      res.redirect('/posts')
    })
},
destroy (req, res, next) {
  const {id} = req.params

  kx
    .delete()
    .from('posts')
    .where({id})
    .then(() => res.redirect('/posts'))
    .catch(error => next(error))
},
edit (req, res, next) {
  const {id} = req.params

  kx
    .first()
    .from('posts')
    .where({id}) // <-- syntax sugar for {id: id}
    .then(post => res.render('posts/edit', {post}))
},
update (req, res, next) {
  const {id} = req.params
  const {title, content} = req.body
  const post = {title, content}

  if (req.file) {
    const {filename} = req.file
    post.photo_path = `/uploads/${filename}`
  }

  kx('posts')
    .update(post)
    .where({id})
    .then(() => res.redirect(`/posts/${id}`))
    .catch(error => next(error))
}
}
module.exports = PostsController
