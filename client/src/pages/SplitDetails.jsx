import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const SplitDetails = () => {
  const { id } = useParams();
  const [split, setSplit] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const fetchSplit = async () => {
    try {
      const res = await API.get(`/splits/${id}`);
      setSplit(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchSplit();
  }, [id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || !description) return setError("Amount and description are required.");

    try {
      await API.post("/splits/expense", {
        splitId: id,
        amount: Number(amount),
        description,
      });
      setAmount("");
      setDescription("");
      fetchSplit(); // refresh split details
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.error || "Failed to add expense.");
    }
  };

  if (!split) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">{split.title}</h1>
      <p className="mb-2">Total Amount: ₹{split.total}</p>
      <p className="mb-4">
        Participants: {split.participants.map((p) => p.name).join(", ")}
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Expense</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleAddExpense} className="flex flex-col gap-2 max-w-md">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            Add Expense
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Expenses</h2>
        {split.expenses.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          <ul>
            {split.expenses.map((exp, idx) => (
              <li key={idx} className="mb-1">
                ₹{exp.amount} - {exp.description} (Paid by: {exp.paidBy.name})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SplitDetails;
