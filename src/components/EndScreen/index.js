import "./style.scss";

const EndScreen = ({ userAnswers }) => {
  let numberOfCorrectAnswers = 0;
  let avgTimePerQuestion = 0;

  userAnswers.forEach((answer) => {
    avgTimePerQuestion += answer.time;
    numberOfCorrectAnswers = answer.isCorrect
      ? numberOfCorrectAnswers + 1
      : numberOfCorrectAnswers;
  });
  avgTimePerQuestion = avgTimePerQuestion / userAnswers.length;
  return (
    <>
      <div className="gradient-border">
        <div className="card card--first" data-testid="endscreen-summary">
          <h2 className="card__heading card--first__heading">Overview</h2>
          <div>
            <ul>
              <li>
                You got {numberOfCorrectAnswers}/10 questions correct.
                {numberOfCorrectAnswers !== 0 && " Good for you!"}
              </li>
              <li>
                It took you an average of {avgTimePerQuestion} seconds to answer
                each question.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {userAnswers.map(
        ({ question, answer, isCorrect, correctAnswer, time }, i) => {
          return (
            <div className="gradient-border" key={question}>
              <div className="card">
                <h2 className="card__heading">
                  Q{i + 1}: {question}
                </h2>
                <p className="card__answer">
                  {answer === "timeout" ? (
                    <>
                      You{" "}
                      <span className="emphasize emphasize--wrong">
                        timed out.
                      </span>
                    </>
                  ) : (
                    <>
                      In <span className="emphasize">{time}</span> seconds, you
                      came up with{" "}
                      <span
                        className={`emphasize ${
                          !isCorrect ? "emphasize--wrong" : "emphasize--right"
                        }`}
                      >
                        {answer}
                      </span>
                      .
                      {isCorrect ? (
                        <>
                          This was{" "}
                          <span className="emphasize emphasize--right">
                            correct
                          </span>
                          !
                        </>
                      ) : (
                        <>
                          {" "}
                          The right answer was
                          <span className="emphasize emphasize--right">
                            {" " + correctAnswer}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>
          );
        }
      )}
    </>
  );
};

export default EndScreen;
