import { PubSub, NotificationCenter } from "@livestorm/plugin";
import { Countdown } from "../../shared";
import { notificationTimerTemplate } from "../../templates";

export const stopNormalCountdown = (): void => {
  PubSub.publish("countdown-end", {
    data: { countdownType: "normal-countdown" },
  });
  Countdown.stop();
  NotificationCenter.showIframe(notificationTimerTemplate, {
    timeLeft: 0,
    colour: "--color-red-700",
    messageType: "error",
    title: "Timer Stopped",
  });
};
