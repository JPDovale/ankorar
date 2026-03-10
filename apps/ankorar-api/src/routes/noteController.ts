import { createNoteRoute } from "../controllers/note/createNote";
import { getNoteRoute } from "../controllers/note/getNote";
import { getNotesGraphRoute } from "../controllers/note/getNotesGraph";
import { listNotesRoute } from "../controllers/note/listNotes";
import { updateNoteRoute } from "../controllers/note/updateNote";
import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";

const noteController = Controller.create({
  name: "Note",
  routeConversor: Route.fastifyRouterConversor,
});

noteController.appendRoute(createNoteRoute);
noteController.appendRoute(getNotesGraphRoute);
noteController.appendRoute(getNoteRoute);
noteController.appendRoute(listNotesRoute);
noteController.appendRoute(updateNoteRoute);

export { noteController };
