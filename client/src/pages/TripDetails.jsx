import React, { useEffect, useState } from "react";
import API from "../api";
import AddExpenseForm from "../components/AddExpenseForm";

const TripDetails = ({ tripId }) => {
  const [trip, setTrip] = useState(null);

  const fetchTrip = async () => {
    const res = await API.get(`/trips/${tripId}`);
    setTrip(res.data);
  };

  useEffect(() => {
    fetchTrip();
  }, []);

  if (!trip) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{trip.title}</h1>
      <h2 className="mt-4 font-semibold">Participants:</h2>
      <ul>
        {trip.participants.map(p => <li key={p._id}>{p.name}</li>)}
      </ul>

      <h2 className="mt-4 font-semibold">Expenses:</h2>
      <ul>
        {trip.expenses.map(e => (
          <li key={e._id}>
            {e.description} - ₹{e.amount} (Paid by {trip.participants.find(p => p._id === e.paidBy)?.name})
          </li>
        ))}
      </ul>

      <h2 className="mt-4 font-semibold">Add Expense:</h2>
      <AddExpenseForm
        tripId={trip._id}
        participants={trip.participants}
        onAdded={() => fetchTrip()}
      />
    </div>
  );
};

export default TripDetails;
