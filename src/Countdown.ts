export class Countdown {
  static interval: NodeJS.Timeout;

  static start(
    timeInMinutes: number,
    onIntervalChange: ({
      timeLeft,
      seconds,
      minutes,
    }: {
      timeLeft: number;
      seconds?: number;
      minutes?: number;
    }) => void,
    onCountdownEnd: () => void
  ): void {
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

      if (timeLeft < 0) {
        clearInterval(this.interval);
        onCountdownEnd();
      }
    }, 1000);
  }

  static stop(onStopInterval?: () => void): void {
    clearInterval(this.interval);
    onStopInterval();
  }
}
