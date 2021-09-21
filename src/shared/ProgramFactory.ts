import { Storage } from "@livestorm/plugin";
import { ProgramItem } from "../models/ProgramItem";

export class ProgramFactory {
  static currentProgramItem: ProgramItem;

  static async createProgram(value: ProgramItem[]): Promise<Response> {
    const programString = JSON.stringify(value);
    const response = await Storage.setItem("program", programString, {
      scope: "event",
    });
    this, this.initializeCurrentProgramItem(value[0]);
    return response;
  }

  static async getProgram(): Promise<ProgramItem[]> {
    const programJSON = await Storage.getItem("program", { scope: "event" });
    try {
      const program = JSON.parse(programJSON);
      this.initializeCurrentProgramItem(program[0]);
      return program;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  private static initializeCurrentProgramItem(programItem: ProgramItem) {
    if (!ProgramFactory.currentProgramItem)
      ProgramFactory.currentProgramItem = programItem;
  }
}
