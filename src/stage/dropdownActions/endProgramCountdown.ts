import { PubSub } from "@livestorm/plugin";
import { Countdown } from "../../shared";

export const endProgramCountdown = (): void => {
  PubSub.publish("countdown-end", {
    data: { countdownType: "program-countdown" },
  });
  Countdown.stop();
};
