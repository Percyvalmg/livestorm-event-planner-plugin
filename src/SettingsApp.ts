/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { PubSub, Settings } from "@livestorm/plugin";
const template = require("./templates/settings.html").default;
import { ProgramItem } from "./models/ProgramItem";
import { ProgramFactory } from "./models/ProgramFactory";

export default async () => {
  PubSub.subscribe("change-program", async ({ program }) => {
    ProgramFactory.createProgram(program as ProgramItem[]);
  });

  const getProgramResponse = await ProgramFactory.getProgram();
  const program = getProgramResponse ? getProgramResponse : [];

  Settings.Event.registerPanel({
    template,
    variables: { program },
    onMessage: ({ program }) => {
      ProgramFactory.createProgram(program as ProgramItem[]);

      PubSub.publish("change-program", {
        data: { program },
        scope: "event",
      });
    },
  });
};
