export interface onIntervalChangeProps {
  timeLeft: number;
  seconds?: number;
  minutes?: number;
}

export class Countdown {
  static interval: NodeJS.Timeout;
  static normalCountDownInProgress = false;
  static programCountDownInProgress = false;

  static start(
    timeInMinutes: number,
    onIntervalChange: ({
      timeLeft,
      seconds,
      minutes,
    }: onIntervalChangeProps) => void,
    onCountdownEnd: () => void
  ): void {
    if (this.normalCountDownInProgress || this.programCountDownInProgress)
      this.stop();
    const countDownDate = new Date(
      new Date().getTime() + timeInMinutes * 60000
    ).getTime();
    this.interval = setInterval(function () {
      const now = new Date().getTime();
      const timeLeft = countDownDate - now;
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      onIntervalChange({
        timeLeft,
        seconds,
        minutes,
      });

      if (timeLeft <= 0) {
        onCountdownEnd();
      }
    }, 1000);
  }

  static stop(onStopInterval?: () => void): void {
    clearInterval(this.interval);
    if (onStopInterval) onStopInterval();
  }
}
