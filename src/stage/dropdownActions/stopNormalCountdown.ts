import { PubSub } from "@livestorm/plugin";

export const stopNormalCountdown = (): void => {
  PubSub.publish("countdown-end", {
    data: { countdownType: "normal-countdown" },
    scope: "session",
  });
};
