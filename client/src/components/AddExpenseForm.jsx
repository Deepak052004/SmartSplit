import React, { useState } from "react";
import API from "../api";

const AddExpenseForm = ({ tripId, participants, onAdded }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(participants[0]?._id || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/trips/${tripId}/expenses`, { description, amount, paidBy });
      onAdded(res.data);
      setDescription("");
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        placeholder="Expense Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className="border p-2 rounded w-full">
        {participants.map(p => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Add Expense</button>
    </form>
  );
};

export default AddExpenseForm;
