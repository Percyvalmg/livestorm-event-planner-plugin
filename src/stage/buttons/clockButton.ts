import { Stage } from "@livestorm/plugin";
import { DropdownAction, ProgramItem } from "../../models";
import {
  startNormalCountDown,
  startProgramCountdown,
  endProgramCountdown,
  stopNormalCountdown,
} from "../dropdownActions";

export const registerClockButton = (
  programExists: boolean,
  programItem?: ProgramItem,
  nextProgramItemTitle?: string
): void => {
  Stage.Buttons.registerStageButton({
    label: "Event Timmer",
    icon: "clock",
    dropdownActions: getDropdownActions(programExists),
    onClick: async (event) => {
      const {
        clickedElement: { name },
      } = event as unknown as {
        clickedElement: DropdownAction;
      };

      handleStageClockButtonDropdownActionPressed(
        name,
        programItem,
        nextProgramItemTitle
      );
    },
  });
};

const getDropdownActions = (programExists: boolean) => {
  return programExists
    ? [
        { name: "start", label: "Start Program" },
        { name: "end", label: "End Program" },
        { name: "5m", label: "Start 5 minute timer" },
        { name: "10m", label: "Start 10 minute timer" },
        { name: "15m", label: "Start 15 minute timer" },
        { name: "stop", label: "Stop timer " },
      ]
    : [
        { name: "5m", label: "Start 5 minute timer " },
        { name: "10m", label: "Start 10 minute timer" },
        { name: "15m", label: "Start 15 minute timer" },
        { name: "stop", label: "Stop timer" },
      ];
};

const handleStageClockButtonDropdownActionPressed = (
  name: string,
  programItem: ProgramItem,
  nextProgramItemTitle?: string
) => {
  switch (name) {
    case "start":
      startProgramCountdown(programItem, nextProgramItemTitle);
      break;
    case "end":
      endProgramCountdown();
      break;
    case "5m":
      startNormalCountDown(5);
      break;
    case "10m":
      startNormalCountDown(10);
      break;
    case "15m":
      startNormalCountDown(15);
      break;
    case "stop":
      stopNormalCountdown();
      break;
  }
};
