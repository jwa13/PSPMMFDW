import { Request, Response, Router } from "express";
import { pino } from 'pino';

export class AppController {
  public router: Router = Router();
  private log: pino.Logger = pino();

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter() {

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
    
  }
}
