import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [splits, setSplits] = useState([]);

  const fetchSplits = async () => {
    try {
      const res = await API.get("/splits");
      setSplits(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    fetchSplits();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-screen p-6 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-10 p-4 shadow-sm">
        <h1 className="text-4xl font-bold text-indigo-600">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Create Trip Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/create-split")}
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          + Create New Trip
        </button>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-auto flex-1">
        {splits.length === 0 ? (
          <p className="text-gray-500">No trips yet. Create one!</p>
        ) : (
          <AnimatePresence>
            {splits.map((split) => (
              <motion.div
                key={split._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1"
                onClick={() => navigate(`/split/${split._id}`)}
              >
                <h2 className="text-xl font-bold mb-2">{split.title}</h2>
                <p className="mb-1">Total Amount: ₹{split.total}</p>
                <p className="text-gray-600 text-sm">
                  Participants: {split.participants.map(p => p.name).join(", ")}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
