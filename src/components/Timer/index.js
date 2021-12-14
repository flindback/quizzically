const Timer = ({ timeLeft }) => {
  return (
    <>
      <p>
        Time left: <span data-testid="timer-counter">{timeLeft / 1000}</span>
      </p>
    </>
  );
};

export default Timer;
