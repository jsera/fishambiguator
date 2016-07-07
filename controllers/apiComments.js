// comments only make sense in the context of a pairing
// When we receive a new comment, try to get the pair, if the pair doesn't exist,
// create a pair, then get it.
// Then create the comment and attach it to the pairing.

// We want author name, date, and comment body.

// on comment update, we need to check if the curent user owns this comment, unless the user is a superuser.