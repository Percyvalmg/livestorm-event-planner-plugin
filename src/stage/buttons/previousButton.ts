import { PubSub, Stage } from "@livestorm/plugin";

export const registerPreviousButton = (): void => {
  Stage.Buttons.registerStageButton({
    label: "Previous",
    icon: "chevron-left",
    onClick: () => {
      PubSub.publish("previous-item", { data: undefined });
    },
  });
};
