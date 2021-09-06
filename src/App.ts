import { Users, Stage, PubSub, Modal } from "@livestorm/plugin";
const modalTimeTemplate = require("./modalTime.html").default;

export default async function () {
  const me = await Users.me();

  const program = [
    { order: 1, title: "Intro", timeInMinutes: 2 },
    { order: 2, title: "Presentation", timeInMinutes: 4 },
    { order: 3, title: "Outro", timeInMinutes: 3 },
  ];

  if (me.is_team_member) {
    PubSub.subscribe(
      "item-countdown-complete",
      ({
        order,
        title,
        timeInMinutes,
      }: {
        order: number;
        title: string;
        timeInMinutes: number;
      }) => {
        if (program.length !== order) {
          const index = order++;
          showModal(program[index]);
        }
      }
    );

    addStageButton(program);
  }
}

const addStageButton = (program) => {
  Stage.Buttons.registerStageButton({
    label: "Start Event",
    icon: "clock",
    onClick: async (event) => {
      showModal(program[0]);
    },
  });
};

const showModal = (program: {
  order: number;
  title: string;
  timeInMinutes: number;
}) => {
  Modal.showIframe({
    size: "normal",
    template: modalTimeTemplate,
    variables: {
      title: program.title,
      timeInMinutes: program.timeInMinutes,
    },
    onMessage: () => {
      PubSub.publish("item-countdown-complete", {
        data: program,
      });
    },
  });
};
