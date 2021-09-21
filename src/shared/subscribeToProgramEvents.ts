import { PubSub } from "@livestorm/plugin";
import { Countdown } from "./Countdown";
import { ProgramFactory } from "./ProgramFactory";
import { startCountdown } from "./startCountdown";
import { ProgramItem } from "../models";

export const subscribeToProgramEvents = (program: ProgramItem[]): void => {
  PubSub.subscribe("next-item", () => handleNextButtonPressed(program));
};

const handleNextButtonPressed = (program: ProgramItem[]) => {
  if (
    Countdown.programCountDownInProgress &&
    !Countdown.normalCountDownInProgress
  ) {
    const order = ProgramFactory.currentProgramItem.order;
    const isWithinProgramBoundry = order >= 1 && order < program.length;

    if (isWithinProgramBoundry) {
      Countdown.stop();

      ProgramFactory.currentProgramItem = program[order];
      startCountdown(
        program[order].timeInMinutes,
        program[order].title,
        program[order + 1] ? program[order + 1].title : undefined
      );
    }
  }
};
