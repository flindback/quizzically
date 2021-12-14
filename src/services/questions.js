import axios from "axios";
import { decode } from "he";

const get = async () => {
  const { data } = await axios.get(
    "https://opentdb.com/api.php?amount=10&category=18&type=multiple"
  );
  let questionList = data.results.map(
    ({ question, correct_answer, incorrect_answers }) => {
      let temp = [
        { text: decode(correct_answer), isCorrect: true },
        { text: decode(incorrect_answers[0]), isCorrect: false },
        { text: decode(incorrect_answers[1]), isCorrect: false },
        { text: decode(incorrect_answers[2]), isCorrect: false },
      ];
      question = decode(question);
      return {
        question,
        answers: temp.sort((a, b) => (a.text > b.text ? 1 : -1)),
        correctAnswer: correct_answer,
      };
    }
  );

  return questionList;
};
const questions = { get };
export default questions;
