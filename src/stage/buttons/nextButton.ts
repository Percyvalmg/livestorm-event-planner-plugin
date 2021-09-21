import { PubSub, Stage } from "@livestorm/plugin";

export const registerNextButton = (): void => {
  Stage.Buttons.registerStageButton({
    label: "Next",
    icon: "chevron-right",
    onClick: () => {
      PubSub.publish("next-item", { data: undefined });
    },
  });
};
