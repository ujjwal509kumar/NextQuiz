import React, { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import axios from 'axios';
import Link from 'next/link';

const QuizComponent = () => {
    const { data: session } = useSession();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('any');
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [scoreSaved, setScoreSaved] = useState(false);

    const fetchQuestions = () => {
        let url = 'https://opentdb.com/api.php?amount=10&type=multiple';
        if (category !== 'any') {
            url += `&category=${category}`;
        }

        setLoading(true);
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    setQuestions(data.results);
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setLoading(false);
                    setQuizStarted(true);
                    setQuizCompleted(false);
                    setScoreSaved(false); // Reset scoreSaved when starting a new quiz
                } else {
                    setLoading(false);
                    alert('No questions found for the selected category.');
                }
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
                setLoading(false);
            });
    };

    const handleAnswer = (isCorrect, e) => {
        if (isCorrect) {
            setScore(score + 1);
            e.target.classList.add('bg-green-500', 'text-white');
        } else {
            e.target.classList.add('bg-red-500', 'text-white');
            Array.from(document.getElementById('answer-buttons').children).forEach(button => {
                if (button.dataset.correct === 'true') {
                    button.classList.add('bg-green-500', 'text-white');
                }
            });
        }
        Array.from(document.getElementById('answer-buttons').children).forEach(button => {
            button.disabled = true;
        });
        document.getElementById('next-button').classList.remove('hidden');
    };

    const nextQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        document.getElementById('next-button').classList.add('hidden');
        Array.from(document.getElementById('answer-buttons').children).forEach(button => {
            button.classList.remove('bg-green-500', 'bg-red-500', 'text-white');
            button.disabled = false;
        });
    };

    const decodeHtml = (html) => {
        let txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    const saveScore = async () => {
        if (!scoreSaved) {
            try {
                const response = await axios.post('/api/savescore', {
                    name: session.user.name,
                    score,
                    category 
                });
                console.log(response.data);
                setScoreSaved(true);
            } catch (error) {
                console.error('Error saving score:', error);
            }
        }
    };

    useEffect(() => {
        if (currentQuestionIndex >= questions.length && questions.length > 0 && !scoreSaved) {
            saveScore();
            setQuizCompleted(true);
        }
    }, [currentQuestionIndex, questions, scoreSaved]);

    if (!session) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100">Please sign in to take the quiz.</div>;
    }

    if (loading) {
        return <div className="loader-wrapper flex justify-center items-center min-h-screen bg-gray-100"><div className="loader"></div></div>;
    }

    if (!quizStarted) {
        return (
            <div className="min-h-96 md:min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
                <p className="mb-4 text-lg">Signed in as {session.user.name}</p>
                <div id="category-container" className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                    <label htmlFor="category" className="block mb-2 text-lg font-medium text-gray-700">Select Category:</label>
                    <select id="category" className="block w-full mt-1 p-2 border border-gray-300 rounded-md" onChange={e => setCategory(e.target.value)}>
                        <option value="any">Any Category</option>
                        <option value="9">General Knowledge</option>
                        <option value="10">Entertainment: Books</option>
                        <option value="11">Entertainment: Film</option>
                        <option value="12">Entertainment: Music</option>
                        <option value="13">Entertainment: Musicals & Theatres</option>
                        <option value="14">Entertainment: Television</option>
                        <option value="15">Entertainment: Video Games</option>
                        <option value="16">Entertainment: Board Games</option>
                        <option value="17">Science & Nature</option>
                        <option value="18">Science: Computers</option>
                        <option value="19">Science: Mathematics</option>
                        <option value="20">Mythology</option>
                        <option value="21">Sports</option>
                        <option value="22">Geography</option>
                        <option value="23">History</option>
                        <option value="24">Politics</option>
                        <option value="25">Art</option>
                        <option value="26">Celebrities</option>
                        <option value="27">Animals</option>
                        <option value="28">Vehicles</option>
                        <option value="29">Entertainment: Comics</option>
                        <option value="30">Science: Gadgets</option>
                        <option value="31">Entertainment: Japanese Anime & Manga</option>
                        <option value="32">Entertainment: Cartoon & Animations</option>
                    </select>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full" onClick={fetchQuestions}>Start Quiz</button>
                </div>
                <button className="bg-red-500 text-white px-4 py-2 rounded mb-4 mt-4" onClick={() => signOut()}>Sign out</button>
            </div>
        );
    }

    if (quizCompleted) {
        return (
            <div className="min-h-96 md:min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
                <p className="text-2xl font-bold mb-4">Quiz completed!</p>
                <p className="text-lg mb-4">Your total score is: {score} out of {questions.length}</p>
                <div className="flex justify-between">
                    <Link href='/scorelist'><button className="bg-blue-500 text-white px-4 py-2 mx-2 rounded">Score List</button></Link>
                    <button className="bg-red-500 text-white px-4 py-2 mx-2 rounded" onClick={() => signOut()}>Sign out</button>
                </div>

            </div>
        );
    }

    if (questions.length === 0 || !questions[currentQuestionIndex]) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100">No questions available. Please try again later.</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            <p className="mb-4 text-lg">Signed in as {session.user.name}</p>

            <div id="quiz-container" className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
                <div id="question-container" className="mb-4">
                    <h5 className="text-xl font-semibold">{decodeHtml(currentQuestion.question)}</h5>
                </div>
                <div id="answer-buttons" className="grid grid-cols-1 gap-4">
                    {answers.map((answer, index) => (
                        <button
                            key={index}
                            className="border rounded px-4 py-2 hover:bg-gray-200"
                            onClick={(e) => handleAnswer(answer === currentQuestion.correct_answer, e)}
                            data-correct={answer === currentQuestion.correct_answer}
                        >
                            {decodeHtml(answer)}
                        </button>
                    ))}
                </div>
                <button id="next-button" className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hidden" onClick={nextQuestion}>Next Question</button>
                <div id="score-container" className="mt-4 text-lg">
                    Score: {score} / {questions.length}
                </div>
            </div>
        </div>
    );
};

export default QuizComponent;
