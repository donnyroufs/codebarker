export class StatusColourPickerUtil {
  public static getColour(status: string): string {
    if (status === 'pending') {
      return '#615c94';
    }

    if (status === 'declined') {
      return '#945c7b';
    }

    return '#5c946d';
  }
}
