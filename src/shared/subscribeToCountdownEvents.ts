import { PubSub } from "@livestorm/plugin";
import { Countdown } from "./Countdown";

export const subscribeToCountdownEvents = (): void => {
  PubSub.subscribe("countdown-started", (data) => {
    if (data.countdownType === "normal-countdown") {
      Countdown.normalCountDownInProgress = true;
      Countdown.programCountDownInProgress = false;
    }

    if (data.countdownType === "program-countdown") {
      Countdown.normalCountDownInProgress = false;
      Countdown.programCountDownInProgress = true;
    }
  });

  PubSub.subscribe("countdown-end", () => {
    Countdown.normalCountDownInProgress = false;
    Countdown.programCountDownInProgress = false;
  });
};
