import { PubSub } from "@livestorm/plugin";
import { ProgramItem } from "../../models";
import { ProgramFactory } from "../../shared";

export const startProgramCountdown = (
  programItem: ProgramItem,
  nextProgramItemTitle: string
): void => {
  ProgramFactory.currentProgramItem = programItem;
  PubSub.publish("countdown-started", {
    data: {
      programItem,
      nextProgramItemTitle,
      countdownType: "program-countdown",
    },
    scope: "session",
  });
};
