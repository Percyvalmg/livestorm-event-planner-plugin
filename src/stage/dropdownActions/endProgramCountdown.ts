import { PubSub } from "@livestorm/plugin";

export const endProgramCountdown = (): void => {
  PubSub.publish("countdown-end", {
    data: { countdownType: "program-countdown" },
    scope: "session",
  });
};
