import { Storage } from "@livestorm/plugin";
import { ProgramItem } from "./ProgramItem";

export class ProgramFactory {
  static async createProgram(value: ProgramItem[]): Promise<Response> {
    const programString = JSON.stringify(value);
    const response = await Storage.setItem("program", programString, {
      scope: "event",
    });
    return response;
  }

  static async getProgram(): Promise<ProgramItem[]> {
    const programJSON = await Storage.getItem("program", { scope: "event" });
    try {
      const program = JSON.parse(programJSON);
      return program;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
