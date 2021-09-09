/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Storage, PubSub, Settings } from "@livestorm/plugin";
const template = require("./templates/settings/settings.html").default;

export default () => {
  Settings.Event.registerPanel({
    template,
    onMessage: ({ program }) => {
      console.log("onMessage Settings", program);
      Storage.setItem("program", program, { scope: "event" });

      PubSub.publish("change-program", {
        data: { program },
        scope: "event",
      });
    },
  });
};
