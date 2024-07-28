"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const categoryNames = {
  9: "General Knowledge",
  10: "Entertainment: Books",
  11: "Entertainment: Film",
  12: "Entertainment: Music",
  13: "Entertainment: Musicals & Theatres",
  14: "Entertainment: Television",
  15: "Entertainment: Video Games",
  16: "Entertainment: Board Games",
  17: "Science & Nature",
  18: "Science: Computers",
  19: "Science: Mathematics",
  20: "Mythology",
  21: "Sports",
  22: "Geography",
  23: "History",
  24: "Politics",
  25: "Art",
  26: "Celebrities",
  27: "Animals",
  28: "Vehicles",
  29: "Entertainment: Comics",
  30: "Science: Gadgets",
  31: "Entertainment: Japanese Anime & Manga",
  32: "Entertainment: Cartoon & Animations",
};

const ScoreList = () => {
  const [scores, setScores] = useState([]);

  const fetchScores = async () => {
    try {
      const response = await axios.get('/api/getscores');
      setScores(response.data);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center my-8">Score List</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">#</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Score (out of 10)</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Time</th>
              </tr>
            </thead>
            <tbody>
              {[...scores].reverse().map((score, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{score.name}</td>
                  <td className="py-2 px-4 border-b">{score.score}</td>
                  <td className="py-2 px-4 border-b">{categoryNames[score.category] || score.category}</td>
                  <td className="py-2 px-4 border-b">{score.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ScoreList;
