import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import url from "../services/service";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Food",
    date: ""
  });
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${url}/api/transactions`, {
        withCredentials: true
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${url}/api/transactions`, formData, {
        withCredentials: true
      });
      setFormData({ description: "", amount: "", category: "Food", date: "" });
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${url}/api/transactions/${editId}`, formData, {
        withCredentials: true
      });
      setFormData({ description: "", amount: "", category: "Food", date: "" });
      setEditId(null);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/api/transactions/${id}`, {
        withCredentials: true
      });
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id) => {
    const transactionToEdit = transactions.find((t) => t._id === id);
    if (transactionToEdit) {
      setFormData({
        description: transactionToEdit.description,
        amount: transactionToEdit.amount,
        category: transactionToEdit.category,
        date: transactionToEdit.date.slice(0, 10),
      });
      setEditId(id);
    }
  };

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income + expenses;

  const filteredTransactions = transactions.filter((t) => {
    return (
      (filterCategory ? t.category === filterCategory : true) &&
      (filterDate ? t.date.startsWith(filterDate) : true)
    );
  });

  const categories = [...new Set(transactions.map((t) => t.category))];
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: "Amount",
        data: categories.map((cat) =>
          transactions
            .filter((t) => t.category === cat)
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        backgroundColor: ["#3B82F6", "#EF4444", "#FACC15", "#10B981", "#8B5CF6"],
        borderWidth: 1
      }
    ]
  };

  return (
    <>
      <Navbar />
      <div className="p-4 grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Summary Cards */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 p-5 rounded-lg shadow text-center">
            <h3 className="text-lg font-bold text-green-700">Total Income</h3>
            <p className="text-3xl font-bold text-green-800">₹{income}</p>
          </div>
          <div className="bg-red-100 p-5 rounded-lg shadow text-center">
            <h3 className="text-lg font-bold text-red-700">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-800">₹{Math.abs(expenses)}</p>
          </div>
          <div className="bg-blue-100 p-5 rounded-lg shadow text-center">
            <h3 className="text-lg font-bold text-blue-700">Balance</h3>
            <p className="text-3xl font-bold text-blue-800">₹{balance}</p>
          </div>
        </div>

        {/* Form & Pie Chart */}
        <div className="lg:col-span-3 flex flex-col lg:flex-row gap-6">
          {/* Transaction Form */}
          <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/2">
            <h2 className="text-2xl font-bold mb-5 text-center text-blue-700">
              {editId ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <form
              onSubmit={editId ? handleUpdate : handleSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount (+ for income, - for expense)"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
              >
                <option>Food</option>
                <option>Salary</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Other</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                {editId ? "Update Transaction" : "Add Transaction"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setFormData({
                      description: "",
                      amount: "",
                      category: "Food",
                      date: ""
                    });
                  }}
                  className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/2">
            <h2 className="text-2xl font-bold mb-5 text-center text-blue-700">
              Expense Breakdown
            </h2>
            <div className="w-full max-h-[350px] flex justify-center">
              {transactions.length > 0 ? (
                <Pie data={chartData} />
              ) : (
                <p className="text-gray-500 text-lg">No records found</p>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="lg:col-span-3 flex flex-col md:flex-row gap-4 mt-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-4 py-2 rounded-md w-full md:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="month"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border px-4 py-2 rounded-md w-full md:w-auto"
          />
        </div>

        {/* Transactions Table */}
        <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Transactions</h2>
          {filteredTransactions.length > 0 ? (
            <table className="w-full border text-sm md:text-base">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Description</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t._id}>
                    <td className="p-2 border">{t.date.slice(0, 10)}</td>
                    <td className="p-2 border">{t.description}</td>
                    <td className="p-2 border">{t.category}</td>
                    <td
                      className={`p-2 border ${t.amount < 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {t.amount}
                    </td>
                    <td className="p-2 border">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                          onClick={() => handleEdit(t._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                          onClick={() => handleDelete(t._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center text-lg py-4">
              No transactions found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
