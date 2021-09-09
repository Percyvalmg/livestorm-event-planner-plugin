import {
  Users,
  Stage,
  PubSub,
  Modal,
  Settings,
  Storage,
} from "@livestorm/plugin";
import SettingsApp from "./SettingsApp";
const modalTimeTemplate = require("./templates/modalTime.html").default;
interface ProgramItem {
  order: number;
  title: string;
  timeInMinutes: number;
}

Settings.register(SettingsApp);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async function () {
  const me = await Users.me();

  PubSub.subscribe(
    "change-program",
    async ({ program }: { program: ProgramItem[] }) => {
      await Storage.setItem("program", JSON.stringify(program));
    }
  );

  const programJSON = await Storage.getItem("program");
  const program = programJSON ? JSON.parse(programJSON) : undefined;

  console.log("Program", program);

  if (me.is_team_member && program) {
    PubSub.subscribe("item-countdown-complete", (data) => {
      let order = (data as unknown as ProgramItem).order;
      if (program.length !== order) {
        const index = order++;
        showModal(program[index], program.length);
      }
    });

    addStageButton(program[0], program.length);
  }
}

const addStageButton = (program: ProgramItem, programLength: number) => {
  Stage.Buttons.registerStageButton({
    label: "Event Timmer",
    icon: "clock",
    dropdownActions: [
      { name: "start", label: "Start Event Timmer" },
      { name: "end", label: "End Event Timmer" },
    ],
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
    },
    onMessage: () => {
      PubSub.publish("item-countdown-complete", {
        data: program as unknown as Record<string, unknown>,
      });
    },
  });
};
