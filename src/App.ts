import {
  Users,
  Stage,
  PubSub,
  Modal,
  Settings,
  NotificationCenter,
} from "@livestorm/plugin";
import SettingsApp from "./SettingsApp";
import { Countdown } from "./Countdown";
const modalTimeTemplate = require("./templates/modalTime.html").default;
const notificationTimerTemplate =
  require("./templates/notificationTimer.html").default;
import { ProgramItem } from "./models/ProgramItem";
import { ProgramFactory } from "./models/ProgramFactory";

Settings.register(SettingsApp);
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function () {
  const me = await Users.me();
  const program = await ProgramFactory.getProgram();

  if (me.is_team_member && program) {
    PubSub.subscribe("item-countdown-complete", (data) => {
      Countdown.stop(() => {
        console.log("stop")
      })
      let order = (data as unknown as ProgramItem).order;
      if (program.length !== order) {
        const index = order++;
        showModal(program[index], program.length);
      }
    });

    const dropdownActions = program
      ? [
          { name: "start", label: "Start Program" },
          { name: "end", label: "End Program" },
          { name: "5m", label: "Start 5 minute timer" },
          { name: "10m", label: "Start 10 minute timer" },
          { name: "15m", label: "Start 15 minute timer" },
          { name: "stop", label: "Stop timer" },
        ]
      : [
          { name: "5m", label: "Start 5 minute timer" },
          { name: "10m", label: "Start 10 minute timer" },
          { name: "15m", label: "Start 15 minute timer" },
          { name: "stop", label: "Stop timer" },
        ];

    addStageButton(program[0], program.length, dropdownActions);
  }
}

const startCountdown = (itemDurationInMinutes: number) => {
  Countdown.start(
    itemDurationInMinutes,
    ({ timeLeft, seconds, minutes }) => {
      const firstSeconds = seconds === 59 || seconds === 58;
      const firstStart = itemDurationInMinutes - 1 === minutes && firstSeconds;
      const is10SecondInterval = seconds % 8 === 0;
      const showFrame = is10SecondInterval || firstStart;
      const isLessThanOneMinuteLeft = minutes === 0;
      if (showFrame) {
        NotificationCenter.showIframe(notificationTimerTemplate, {
          timeLeft,
          colour: isLessThanOneMinuteLeft
            ? "--color-orange-700"
            : "--color-green-700",
          messageType: isLessThanOneMinuteLeft ? "warning" : "success",
        });
      }
    },
    () => {
      NotificationCenter.showIframe(notificationTimerTemplate, {
        timeLeft: 0,
        colour: "--color-red-700",
        messageType: "error",
      });
    }
  );
};

const addStageButton = (
  program: ProgramItem,
  programLength: number,
  dropdownActions
) => {
  Stage.Buttons.registerStageButton({
    label: "Event Timmer",
    icon: "clock",
    dropdownActions,
    onClick: async (event) => {
      const clicked = event as unknown as {
        clickedElement: { name: string; label: string };
      };

      switch (clicked.clickedElement.name) {
        case "start":
          showModal(program, programLength);
          break;
        case "end":
          showModal({ order: 0, title: "End", timeInMinutes: 0 }, 1);
          break;
        case "5m":
          startCountdown(5);
          break;
        case "10m":
          startCountdown(10);
          break;
        case "15m":
          startCountdown(15);
          break;
        case "stop":
          Countdown.stop(() => {
            NotificationCenter.showIframe(notificationTimerTemplate, {
              timeLeft: 0,
              colour: "--color-red-700",
              messageType: "error",
            });
          });
      }
    },
  });
};

const showModal = (program: ProgramItem, programLength: number) => {
  Modal.showIframe({
    size: "large",
    template: modalTimeTemplate,
    variables: {
      title: program.title,
      timeInMinutes: program.timeInMinutes,
      itemNumber: `${program.order} of ${programLength}`,
      showNextButton: program.order === programLength ? "none" : "block",
    },
    onMessage: ({ event }) => {
      PubSub.publish(event, {
        data: program as unknown as Record<string, unknown>,
      });
      PubSub.publish("item-countdown-complete", {
        data: program as unknown as Record<string, unknown>,
      });
    },
  });
  startCountdown(program.timeInMinutes);
};
