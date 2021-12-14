import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

test("Should render vital buttons", () => {
  render(<App />);

  expect(screen.getByTestId("start-button")).toBeInTheDocument();
  expect(screen.getByTestId("toggle-tooltip-button")).toBeInTheDocument();
});

test("Should render lifeline buttons", async () => {
  render(<App />);

  const startButton = screen.getByTestId("start-button");
  fireEvent.click(startButton);
  await waitFor(() => screen.getByTestId("fiftyfifty-button"));

  const fiftyButton = screen.getByTestId("fiftyfifty-button");
  const timeExtenderButton = screen.getByTestId("time-extender-button");
  expect(fiftyButton).toBeInTheDocument();
  expect(timeExtenderButton).toBeInTheDocument();

  fireEvent.click(fiftyButton);
  fireEvent.click(timeExtenderButton);

  expect(fiftyButton).toBeDisabled();
  expect(timeExtenderButton).toBeDisabled();
}, 5000);

test("Lifeline button should re-render closest UL to show correct number of answers when clicked", async () => {
  render(<App />);
  const startButton = screen.getByTestId("start-button");
  fireEvent.click(startButton);

  await waitFor(() => screen.getByTestId("fiftyfifty-button"));
  const fiftyButton = screen.getByTestId("fiftyfifty-button");
  const answerList = screen.getByTestId("answer-list");

  expect(answerList.childElementCount).toBe(4);
  fireEvent.click(fiftyButton);
  expect(answerList.childElementCount).toBe(2);
}, 5000);

test("Lifeline button should add 10 seconds to timer when clicked", async () => {
  render(<App />);
  const startButton = screen.getByTestId("start-button");
  fireEvent.click(startButton);
  await waitFor(() => screen.getByTestId("timer-counter"));
  let timer = screen.getByTestId("timer-counter");
  expect(timer).toHaveTextContent("15");
  await new Promise((resolve) => {
    setTimeout(resolve, 2100);
  });
  expect(timer).toHaveTextContent("13");
}, 6000);

test("Text content on screen should change on interaction with answer buttons", async () => {
  render(<App />);
  const startButton = screen.getByTestId("start-button");
  fireEvent.click(startButton);
  await waitFor(() => screen.getByTestId("question-card"));
  const answerList = screen.getByTestId("answer-list");

  let question = screen.getByTestId("question");
  let firstHeading = question.innerHTML;
  let answer = answerList.childNodes[0].childNodes[0];
  let firstText = answer.innerHTML;

  fireEvent.click(answer);

  let secondHeading = question.innerHTML;
  let secondText = answer.innerHTML;

  expect(firstHeading).not.toEqual(secondHeading);
  expect(firstText).not.toEqual(secondText);
}, 5000);

test("Displays end screen after 10 questions has been answered.", async () => {
  render(<App />);
  const startButton = screen.getByTestId("start-button");
  fireEvent.click(startButton);
  await waitFor(() => screen.getByTestId("question-card"));

  const answerList = screen.getByTestId("answer-list");
  let answer = answerList.childNodes[0].childNodes[0];
  for (let i = 0; i < 10; i++) {
    fireEvent.click(answer);
  }

  expect(screen.getByTestId("endscreen-summary")).toBeInTheDocument();
}, 5000);
