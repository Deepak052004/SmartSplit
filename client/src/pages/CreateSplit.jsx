import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";

const CreateSplit = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch all registered users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/auth/users"); // backend endpoint to get all users
        setAllUsers(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchUsers();
  }, []);

  const handleUserToggle = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || selectedUsers.length === 0) 
      return setError("Trip title and participants are required.");

    try {
      const res = await API.post("/splits", {
        title,
        participants: selectedUsers,
      });

      navigate(`/split/${res.data._id}`);
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.error || "Failed to create trip.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-8">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Create New Trip
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Trip Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="mb-6">
          <label className="block font-semibold mb-2">Select Participants</label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border p-2 rounded">
            {allUsers.map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => handleUserToggle(user._id)}
                className={`px-3 py-1 rounded ${
                  selectedUsers.includes(user._id)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Trip
        </button>
      </motion.form>
    </div>
  );
};

export default CreateSplit;
