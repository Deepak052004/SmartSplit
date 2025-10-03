import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";

const CreateSplit = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !participants) return;

    try {
      const participantArray = participants.split(",").map((p) => p.trim());
      const res = await API.post("/splits", {
        title,
        total: 0,
        participants: participantArray,
        expenses: [],
      });

      // navigate directly to split details
      navigate(`/split/${res.data._id}`);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-gray-50 p-8">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Create New Split</h1>

        <input
          type="text"
          placeholder="Split Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          placeholder="Participants (comma separated)"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Create Split
        </button>
      </motion.form>
    </div>
  );
};

export default CreateSplit;
