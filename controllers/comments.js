const kx = require('../db/connection')

const CommentsController = {
  create(req, res, next) {
    const{id, event_id} = req.params
    const{content} = req.body
    const{currentUser} = req;
    console.log(req.params)

    kx
      .insert({content, post_id: id, event_id, user_id: currentUser.id})
      .into('comments')
      .then(() => res.redirect(`/events/${event_id}/posts/${id}`))
      .catch(error => next(error))
  }
}

module.exports = CommentsController
