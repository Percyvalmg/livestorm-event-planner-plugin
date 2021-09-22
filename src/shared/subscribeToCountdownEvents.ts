import { NotificationCenter, PubSub } from "@livestorm/plugin";
import { ProgramItem } from "../models";
import { Countdown } from "./Countdown";
import { startCountdown } from "./startCountdown";
import { notificationTimerTemplate } from "../templates";

export const subscribeToCountdownEvents = (): void => {
  PubSub.subscribe("countdown-started", (data) => {
    Countdown.stop();
    if (data.countdownType === "normal-countdown") {
      Countdown.normalCountDownInProgress = true;
      Countdown.programCountDownInProgress = false;
      startCountdown(data.timeInMinutes as unknown as number, "TIMELEFT");
    }

    if (data.countdownType === "program-countdown") {
      const programItem = data.programItem as unknown as ProgramItem;
      startCountdown(
        programItem.timeInMinutes,
        programItem.title,
        data.nextProgramItemTitle as unknown as string
      );

      Countdown.normalCountDownInProgress = false;
      Countdown.programCountDownInProgress = true;
    }
  });

  PubSub.subscribe("countdown-end", () => {
    Countdown.stop();
    NotificationCenter.showIframe(notificationTimerTemplate, {
      timeLeft: 0,
      colour: "--color-red-700",
      messageType: "error",
      title: Countdown.programCountDownInProgress
        ? "Program Ended"
        : "Timer Stopped",
    });

    Countdown.normalCountDownInProgress = false;
    Countdown.programCountDownInProgress = false;
  });
};
