import { PubSub, NotificationCenter } from "@livestorm/plugin";
import { Countdown } from "../../shared";
import { notificationTimerTemplate } from "../../templates";

export const endProgramCountdown = (): void => {
  PubSub.publish("countdown-end", {
    data: { countdownType: "program-countdown" },
  });
  Countdown.stop();
  NotificationCenter.showIframe(notificationTimerTemplate, {
    timeLeft: 0,
    colour: "--color-red-700",
    messageType: "error",
    title: "Program Ended",
  });
};
