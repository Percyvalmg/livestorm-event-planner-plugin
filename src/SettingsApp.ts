import { Storage, PubSub, Settings } from "@livestorm/plugin";
const template = require("./templates/settings.html").default;

export default () => {
  Settings.Event.registerPanel({
    template,
    onMessage: ({ program }) => {
      Storage.setItem("program", program, { scope: "event" });

      /**
       *
       * We are publishing an event to notify everyone in the event's sessions
       * that the background color needs to change.
       *
       * To catch this event, you need to subscribe() to the same key in the room (App.ts file)
       *
       */
      PubSub.publish("change-program", {
        data: { program },
        scope: "event",
      });
    },
  });
};
