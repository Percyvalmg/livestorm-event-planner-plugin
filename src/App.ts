import { Users, Stage, PubSub, Modal } from "@livestorm/plugin";
const modalTimeTemplate = require("./modalTime.html").default;
interface ProgramItem {
  order: number;
  title: string;
  timeInMinutes: number;
}
export default async function () {
  const me = await Users.me();

  const program: ProgramItem[] = [
    { order: 1, title: "Intro", timeInMinutes: 2 },
    { order: 2, title: "Presentation", timeInMinutes: 4 },
    { order: 3, title: "Outro", timeInMinutes: 3 },
  ];

  if (me.is_team_member) {
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
    label: "Start Event",
    icon: "clock",
    onClick: async (event) => {
      showModal(program, programLength);
    },
  });
};

const showModal = (program: ProgramItem, programLength: number) => {
  Modal.showIframe({
    size: "normal",
    template: modalTimeTemplate,
    variables: {
      title: program.title,
      timeInMinutes: program.timeInMinutes,
      itemNumber: `${program.order} of ${programLength}`,
    },
    onMessage: () => {
      PubSub.publish("item-countdown-complete", {
        data: program,
      });
    },
  });
};
