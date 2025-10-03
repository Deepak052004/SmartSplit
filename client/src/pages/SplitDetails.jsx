import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";

const SplitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [split, setSplit] = useState(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");

  useEffect(() => {
    const fetchSplit = async () => {
      try {
        const res = await API.get(`/splits/${id}`);
        setSplit(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
        navigate("/dashboard");
      }
    };
    fetchSplit();
  }, [id, navigate]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!description || !amount || !payer) return;

    try {
      const expense = { description, amount: parseFloat(amount), payer };
      const res = await API.post(`/splits/${id}/expenses`, expense);
      setSplit(res.data); // update split including new total
      setDescription("");
      setAmount("");
      setPayer("");
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  if (!split) return <p className="p-8">Loading split details...</p>;

  return (
    <div className="min-h-screen w-screen p-8 bg-gray-50 flex flex-col">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 text-indigo-600 hover:underline"
      >
        &larr; Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-2">{split.title}</h1>
      <p className="mb-2">Total Amount: ₹{split.total}</p>
      <p className="mb-4 text-gray-600">Participants: {split.participants.join(", ")}</p>

      {/* Expenses List */}
      <h2 className="text-2xl font-semibold mb-2">Expenses</h2>
      {split.expenses.length > 0 ? (
        <ul className="mb-6 flex flex-col gap-3">
          <AnimatePresence>
            {split.expenses.map((exp, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-3 rounded shadow flex justify-between items-center"
              >
                <span>{exp.description} - ₹{exp.amount}</span>
                <span className="text-gray-500">{exp.payer}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <p className="mb-6 text-gray-500">No expenses added yet.</p>
      )}

      {/* Add Expense Form */}
      <h2 className="text-2xl font-semibold mb-2">Add Expense</h2>
      <form onSubmit={handleAddExpense} className="bg-white p-6 rounded shadow-md max-w-md">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <select
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">Select Participant</option>
          {split.participants.map((p, idx) => (
            <option key={idx} value={p}>{p}</option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default SplitDetails;
