import { Request, Response, Router, request } from "express";
import { pino } from "pino";
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport");

export class AppController {
  public router: Router = Router();
  private log: pino.Logger = pino();

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter() {
    this.router.use(
      cookieSession({
        name: "google-auth-session",
        keys: ["key1", "key2"],
      })
    );

    this.router.use(passport.initialize());
    this.router.use(passport.session());
    // Serve the home page
    this.router.get("/", (req: Request, res: Response) => {
      try {
        // Render the "home" template as HTML
        res.render("home");
      } catch (err) {
        this.log.error(err);
      }
    });

    // Serve the calendar page
    this.router.get("/calendar", (req: Request, res: Response) => {
      try {
        // Render the "home" template as HTML
        res.render("calendar");
      } catch (err) {
        this.log.error(err);
      }
    });

    this.router.get("/failed", (req: Request, res: Response) => {
      res.send("Failed");
    });

    this.router.get("/profile", (req: Request, res: Response) => {
      res.send(`Welcomes`);
    });

    this.router.get(
      "/google",
      (req: Request, res: Response, next: any) => {
        console.log("Google");
        next();
      },
      passport.authenticate("google", { scope: ["email", "profile", "openid"] })
    );

    this.router.get(
      "/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      function (req: Request, res: Response) {
        // Successful authentication, redirect to profile.
        console.log("Authentication Called");
        res.redirect("/");
      }
    );
  }
}
