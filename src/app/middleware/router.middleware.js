require("../controllers/passport");

module.exports = {
  loginCheck: (req, res, next) => {
    let user = req.user;
    if (user) {
      next();
    } else {
      res.redirect("/login");
    }
  },

  flashMessages: function (req, res, next) {
    // if there's a flash message, transfer
    // it to the context, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
  },

  home: async (req, res) => {
    try {
      // Render the "home" template as HTML
      res.render("home");
      console.log("home middleware working");
    } catch (err) {
      this.log.error(err);
    }
  },

  calendar: (req, res) => {
    try {
      // Render the "calendar" template as HTML
      res.render("calendar");
      console.log("calendar middleware working");
    } catch (err) {
      this.log.error(err);
    }
  },

  profile: (req, res) => {
    try {
      // Render the "profile" template as HTML
      console.log(req.session);
      res.render("profile");
      console.log("profile middleware working");
    } catch (err) {
      this.log.error(err);
    }
  },

  login: (req, res) => {
    try {
      // Render the "login" template as HTML
      res.render("login");
      console.log("login middleware working");
    } catch (err) {
      this.log.error(err);
    }
  },

  google: (req, res, next) => {
    console.log("Google route working");
    console.log("google middleware working");
    next();
  },

  googleCallback: (req, res) => {
    // Successful authentication, redirect to profile.
    console.log("google callback middleware working");
    res.redirect("/profile");
  },
};
