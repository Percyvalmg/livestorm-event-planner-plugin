import { NotificationCenter } from "@livestorm/plugin";
import { Countdown } from "./Countdown";
import { notificationTimerTemplate } from "../templates";

export const startCountdown = (
  itemDurationInMinutes: number,
  title: string,
  nextItem?: string
): void => {
  Countdown.start(
    itemDurationInMinutes,
    ({ timeLeft, seconds, minutes }) => {
      const firstSeconds = seconds === 59 || seconds === 58;
      const firstStart = itemDurationInMinutes - 1 === minutes && firstSeconds;
      const is5SecondInterval = seconds % 5 === 0;
      const showFrame = is5SecondInterval || firstStart;
      const isLessThanOneMinuteLeft = minutes === 0;
      if (showFrame) {
        NotificationCenter.showIframe(notificationTimerTemplate, {
          timeLeft,
          colour: isLessThanOneMinuteLeft
            ? "--color-orange-700"
            : "--color-green-700",
          messageType: isLessThanOneMinuteLeft ? "warning" : "success",
          title,
          nextItem,
        });
      }
    },
    () => {
      NotificationCenter.showIframe(notificationTimerTemplate, {
        timeLeft: 0,
        colour: "--color-red-700",
        messageType: "error",
        opacity: 0.6,
        title: "TIME LEFT",
      });
    }
  );
};
