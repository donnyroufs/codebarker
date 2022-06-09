import { AnalysisStatus } from '@codebarker/domain';

export class StatusColourPickerUtil {
  public static getColour(status: AnalysisStatus): string {
    if (status === AnalysisStatus.Pending) {
      return '#615c94';
    }

    if (status === AnalysisStatus.Declined) {
      return '#945c7b';
    }

    return '#5c946d';
  }
}
