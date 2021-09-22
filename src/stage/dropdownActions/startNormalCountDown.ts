import { PubSub } from "@livestorm/plugin";

export const startNormalCountDown = (timeInMinutes: number): void => {
  PubSub.publish("countdown-started", {
    data: { countdownType: "normal-countdown", timeInMinutes},
    scope: "session",
  });
};
