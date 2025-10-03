import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <header className="flex justify-between items-center px-12 py-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-indigo-600">SmartSplit</h1>
        <nav className="space-x-6">
          <Link to="/" className="text-gray-600 hover:text-indigo-600">
            Home
          </Link>
          <Link to="/login" className="text-gray-600 hover:text-indigo-600">
            Login
          </Link>
          <Link to="/signup" className="text-gray-600 hover:text-indigo-600">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-5xl font-bold text-indigo-600 mb-6">
          SmartSplit
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Split expenses with friends, track balances, and settle up — all in
          one place. Simple, smart, and stress-free.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="bg-white border px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="px-12 py-20 bg-gray-100">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose SmartSplit?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-indigo-600 mb-2">
              Split Smart
            </h4>
            <p className="text-gray-600">
              Automatically divide bills and expenses with your friends or
              roommates. No more messy calculations.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-indigo-600 mb-2">
              Track Balances
            </h4>
            <p className="text-gray-600">
              Always know who owes what. SmartSplit keeps everything organized
              for you in real time.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold text-indigo-600 mb-2">
              Settle Up
            </h4>
            <p className="text-gray-600">
              Pay back easily with UPI or cash, and mark expenses as settled in
              a single click.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-white border-t">
        <p className="text-gray-500">
          © {new Date().getFullYear()} SmartSplit. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
