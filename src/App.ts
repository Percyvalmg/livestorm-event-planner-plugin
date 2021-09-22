/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Users, Settings } from "@livestorm/plugin";
import SettingsApp from "./SettingsApp";
import { registerClockButton, registerNextButton } from "./stage/buttons";
import {
  subscribeToCountdownEvents,
  ProgramFactory,
  subscribeToProgramEvents,
} from "./shared";

Settings.register(SettingsApp);
export default async function () {
  const me = await Users.me();
  const program = await ProgramFactory.getProgram();

  if (me.is_team_member) {
    subscribeToCountdownEvents();
    if (program.length) {
      subscribeToProgramEvents(program);
      registerClockButton(true, program[0], program[1].title);
      registerNextButton();
    } else {
      registerClockButton(false);
    }
  }
}
