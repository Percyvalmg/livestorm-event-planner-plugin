import { PubSub } from "@livestorm/plugin";
import { startCountdown } from "../../shared/startCountdown";

export const startNormalCountDown = (timeInMinutes: number): void => {
  PubSub.publish("countdown-started", {
    data: {
      countdownType: "normal-countdown",
    },
  });
  startCountdown(timeInMinutes, "TIMELEFT");
};
