import { PubSub } from "@livestorm/plugin";
import { ProgramItem } from "../../models";
import { ProgramFactory, Countdown, startCountdown } from "../../shared";

export const startProgramCountdown = (
  programItem: ProgramItem,
  nextProgramItemTitle: string
): void => {
  ProgramFactory.currentProgramItem = programItem;
  if (
    Countdown.normalCountDownInProgress ||
    Countdown.programCountDownInProgress
  ) {
    Countdown.stop();
  }

  PubSub.publish("countdown-started", {
    data: { countdown: programItem.title, countdownType: "program-countdown" },
  });

  startCountdown(
    programItem.timeInMinutes,
    programItem.title,
    nextProgramItemTitle
  );
};
