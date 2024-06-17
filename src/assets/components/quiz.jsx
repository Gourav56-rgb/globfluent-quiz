import React, { useEffect, useRef, useState } from "react";
import { quiz } from "../quiz";
import "./quiz.css";

const Quiz = () => {
  let [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(quiz[index]);
  const [choose, setChoose] = useState(false);
  const [mark, setMark] = useState(0);
  const [result, setResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [reviewAnswers, setReviewAnswers] = useState(false);

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);

  const optionArray = [option1, option2, option3, option4];

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("quizState"));
    if (savedState) {
      setIndex(savedState.index);
      setQuestion(quiz[savedState.index]);
      setChoose(savedState.choose);
      setMark(savedState.mark);
      setResult(savedState.result);
      setUserAnswers(savedState.userAnswers);

      savedState.userAnswers.forEach((ans, i) => {
        if (ans === 1) optionArray[i].current.classList.add("correct");
        if (ans === -1) optionArray[i].current.classList.add("wrong");
      });
    }
  }, []);

  useEffect(() => {
    if (result) {
      localStorage.removeItem("quizState");
    } else {
      localStorage.setItem(
        "quizState",
        JSON.stringify({ index, choose, mark, result, userAnswers })
      );
    }
  }, [index, choose, mark, result, userAnswers]);

  const correctAnswer = (e, ans) => {
    if (choose === false) {
      let newUserAnswers = [...userAnswers];
      if (question.ans === ans) {
        e.target.classList.add("correct");
        setChoose(true);
        setMark((prev) => prev + 1);
        newUserAnswers[index] = ans;
      } else {
        e.target.classList.add("wrong");
        setChoose(true);
        optionArray[question.ans - 1].current.classList.add("correct");
        newUserAnswers[index] = ans;
      }
      setUserAnswers(newUserAnswers);
    }
  };

  const nextQuestion = () => {
    if (choose === true) {
      if (index === quiz.length - 1) {
        setResult(true);
        return 0;
      }
      setIndex(++index);
      setQuestion(quiz[index]);
      setChoose(false);
      optionArray.map((option) => {
        option.current.classList.remove("wrong");
        option.current.classList.remove("correct");
        return null;
      });
    }
  };

  const resetQuiz = () => {
    setIndex(0);
    setQuestion(quiz[0]);
    setMark(0);
    setResult(false);
    setChoose(false);
    setUserAnswers([]);
    localStorage.removeItem("quizState");
  };

  const startReview = () => {
    setReviewAnswers(true);
  };

  const exitReview = () => {
    setReviewAnswers(false);
  };

  return (
    <div className="w-160 mx-auto mt-150 bg-white text-[#262626] flex flex-col gap-20 rounded-10 px-50 py-40">
      <h1 className="font-bold text-6xl">Quiz App</h1>
      <hr className="h-2 border-none bg-[#707070]" />
      {result ? (
        <>
          <h2>
            You scored {mark} out of {quiz.length}
          </h2>
          <button
            onClick={startReview}
            className="mx-auto w-[250px] h-[65px] bg-[#489a3f] text-white text-[25px] font-medium rounded-[8px] cursor-pointer"
          >
            Review Answers
          </button>
          <button
            onClick={resetQuiz}
            className="mx-auto w-[250px] h-[65px] bg-[#9a423f] text-white text-[25px] font-medium rounded-[8px] cursor-pointer"
          >
            Reset
          </button>
        </>
      ) : (
        <>
          <h2 className="text-[27px] font-medium">
            {index + 1}. {question.question}
          </h2>
          <ul>
            <li
              ref={option1}
              onClick={(e) => correctAnswer(e, 1)}
              className="flex items-center h-[70px] pl-[15px] border border-[#686868] rounded-[8px] mb-[20px] text-[20px] cursor-pointer"
            >
              {question.option1}
            </li>
            <li
              ref={option2}
              onClick={(e) => correctAnswer(e, 2)}
              className="flex items-center h-[70px] pl-[15px] border border-[#686868] rounded-[8px] mb-[20px] text-[20px] cursor-pointer"
            >
              {question.option2}
            </li>
            <li
              ref={option3}
              onClick={(e) => correctAnswer(e, 3)}
              className="flex items-center h-[70px] pl-[15px] border border-[#686868] rounded-[8px] mb-[20px] text-[20px] cursor-pointer"
            >
              {question.option3}
            </li>
            <li
              ref={option4}
              onClick={(e) => correctAnswer(e, 4)}
              className="flex items-center h-[70px] pl-[15px] border border-[#686868] rounded-[8px] mb-[20px] text-[20px] cursor-pointer"
            >
              {question.option4}
            </li>
          </ul>
          <button
            onClick={nextQuestion}
            className="mx-auto w-[250px] h-[65px] bg-[#9a423f] text-white text-[25px] font-medium rounded-[8px] cursor-pointer"
          >
            {index === quiz.length - 1 ? "Submit" : "Next"}
          </button>
          <div className="mx-auto text-[18px]">
            {index + 1} out of {quiz.length} questions
          </div>
        </>
      )}
      {reviewAnswers ? (
        <>
          <div>
            <h2>Review Answers</h2>
            <ol>
              {quiz.map((q, i) => (
                <li key={i} className="mb-4">
                  <p className="font-bold">
                    {i + 1}. {q.question}
                  </p>
                  <p>
                    Your answer: <span>{q[`option${userAnswers[i]}`]}</span>
                  </p>
                  <p>
                    Correct answer:{" "}
                    <span className="text-green-500">
                      {q[`option${q.ans}`]}
                    </span>
                  </p>
                </li>
              ))}
            </ol>
            <button
              onClick={exitReview}
              className="mx-auto w-[250px] h-[65px] bg-[#9a423f] text-white text-[25px] font-medium rounded-[8px] cursor-pointer"
            >
              Exit Review
            </button>
          </div>
        </>
      ) : (
        <>
        </>
      )}
    </div>
  );
};

export default Quiz;
