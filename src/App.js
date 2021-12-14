import { useState, useEffect } from "react";
import "./App.scss";
import "./questions.scss";
import Header from "./components/Header";
import questions from "./services/questions";
import Timer from "./components/Timer";
import EndScreen from "./components/EndScreen";
import Button from "./components/Button";

const initialState = {
  tooltipIsTriggered: false,
  questionList: [],
  correctAnswers: {},
  userAnswers: [],
  questionIndex: 0,
  gameOn: false,
  canUse5050: true,
  isTimeLifelineUsed: false,
  timeExtenderUsedThisTurn: false,
  isRemoveIncorrectAnswersUsed: false,
  timeLeft: 15000,
};

const App = () => {
  const [state, setState] = useState(initialState);
  const {
    tooltipIsTriggered,
    questionList,
    userAnswers,
    questionIndex,
    gameOn,
    isTimeLifelineUsed,
    isRemoveIncorrectAnswersUsed,
    timeLeft,
    timeExtenderUsedThisTurn,
  } = state;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateState = (mutation) => {
    setState({ ...state, ...mutation });
  };

  const startGame = async () => {
    const questionList = await questions.get();
    updateState({
      questionList,
      questionIndex: 0,
      userAnswers: [],
      gameOn: true,
    });
  };

  const triggerTooltip = () => {
    updateState({ tooltipIsTriggered: !tooltipIsTriggered });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveAnswer = (question, correctAnswer, answer, isCorrect = false) => {
    let userAnswer = {
      question,
      answer,
      isCorrect,
      correctAnswer,
      time: 15 - timeLeft / 1000,
    };
    if (timeExtenderUsedThisTurn) {
      userAnswer.time += 10;
    }
    let isGameOver = questionIndex === questionList.length - 1;
    updateState({
      userAnswers: [...userAnswers, userAnswer],
      gameOn: !isGameOver,
      questionIndex: isGameOver ? 0 : questionIndex + 1,
      timeLeft: 15000,
      isTimeLifelineUsed: isGameOver ? false : isTimeLifelineUsed,
      isRemoveIncorrectAnswersUsed: isGameOver
        ? false
        : isRemoveIncorrectAnswersUsed,
      timeExtenderUsedThisTurn: false,
    });
  };

  const on5050Click = () => {
    let incorrect = [];
    let correct = [];
    questionList[questionIndex].answers.forEach((answer) => {
      if (answer.isCorrect) {
        correct.push(answer);
      } else if (incorrect.length < 1) {
        incorrect.push(answer);
      }
    });
    const newAnswers = [...incorrect, ...correct].sort((a, b) =>
      a.text > b.text ? 1 : -1
    );
    const mutation = {
      questionList: questionList.map((q, i) => {
        if (i === questionIndex) {
          return { ...q, answers: newAnswers };
        } else {
          return q;
        }
      }),
    };
    mutation.isRemoveIncorrectAnswersUsed = true;
    updateState(mutation);
  };

  useEffect(() => {
    if (gameOn) {
      const onTimeTick = () => {
        if (timeLeft === 1000) {
          saveAnswer(
            questionList[questionIndex].question,
            questionList[questionIndex].correctAnswer,
            "timeout"
          );
        } else {
          updateState({ timeLeft: timeLeft - 1000 });
        }
      };
      if (timeLeft > 1) {
        const timer = setTimeout(onTimeTick, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [timeLeft, saveAnswer, gameOn, questionIndex, questionList, updateState]);
  return (
    <div className="app">
      <Header showTooltip={tooltipIsTriggered} />
      <div className="button-container">
        <Button
          id={"start-button"}
          testid={"start-button"}
          btnText={gameOn ? "Restart!" : "Start!"}
          onClick={startGame}
          isPrimary
        />
        <Button
          id={"toggle-tooltip-button"}
          testid={"toggle-tooltip-button"}
          btnText="Help?"
          onClick={triggerTooltip}
        />
      </div>
      <main>
        {!gameOn && userAnswers.length === 10 ? (
          <EndScreen userAnswers={userAnswers} />
        ) : (
          gameOn && (
            <div className="gradient-border">
              <div className="question-card" data-testid="question-card">
                <h2 className="question" data-testid="question">
                  {questionList[questionIndex].question}
                </h2>
                <Button
                  id={"fiftyfifty-button"}
                  testid={"fiftyfifty-button"}
                  btnText={"50/50"}
                  disabled={isRemoveIncorrectAnswersUsed}
                  onClick={on5050Click}
                />
                <Button
                  id={"time-extender-button"}
                  testid={"time-extender-button"}
                  btnText={"+10s"}
                  disabled={isTimeLifelineUsed}
                  onClick={() => {
                    updateState({
                      timeLeft: timeLeft + 10000,
                      timeExtenderUsedThisTurn: true,
                      isTimeLifelineUsed: true,
                    });
                  }}
                />
                <Timer timeLeft={timeLeft} />
                <ul className="answer-list" data-testid="answer-list">
                  {questionList[questionIndex].answers.map(
                    ({ text, isCorrect }, i) => {
                      return (
                        <li key={i}>
                          <button
                            className="answer-list__answer"
                            onClick={() => {
                              saveAnswer(
                                questionList[questionIndex].question,
                                questionList[questionIndex].correctAnswer,
                                text,
                                isCorrect
                              );
                            }}
                          >
                            {text}
                          </button>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default App;
