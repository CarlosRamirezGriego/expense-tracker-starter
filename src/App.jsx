import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Salary", amount: "5000", type: "income", category: "salary", date: "2025-01-01" },
    { id: 2, description: "Rent", amount: "1200", type: "expense", category: "housing", date: "2025-01-02" },
    { id: 3, description: "Groceries", amount: "150", type: "expense", category: "food", date: "2025-01-03" },
    { id: 4, description: "Freelance Work", amount: "800", type: "expense", category: "salary", date: "2025-01-05" },
    { id: 5, description: "Electric Bill", amount: "95", type: "expense", category: "utilities", date: "2025-01-06" },
    { id: 6, description: "Dinner Out", amount: "65", type: "expense", category: "food", date: "2025-01-07" },
    { id: 7, description: "Gas", amount: "45", type: "expense", category: "transport", date: "2025-01-08" },
    { id: 8, description: "Netflix", amount: "15", type: "expense", category: "entertainment", date: "2025-01-10" },
  ]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteId, setDeleteId] = useState(null);

  const categories = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];

  const CATEGORY_COLORS = {
    food: '#FF8042',
    housing: '#0088FE',
    utilities: '#FFBB28',
    transport: '#00C49F',
    entertainment: '#8884d8',
    salary: '#82ca9d',
    other: '#ffc658',
  };

  const spendingByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += Number(t.amount);
      } else {
        acc.push({ name: t.category, value: Number(t.amount) });
      }
      return acc;
    }, []);

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount,
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([...transactions, newTransaction]);
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("food");
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    setTransactions(transactions.filter(t => t.id !== deleteId));
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div className="app">
      <h1>Finance Tracker</h1>
      <p className="subtitle">Track your income and expenses</p>

      <div className="summary">
        <div className="summary-card">
          <h3>Income</h3>
          <p className="income-amount">${totalIncome}</p>
        </div>
        <div className="summary-card">
          <h3>Expenses</h3>
          <p className="expense-amount">${totalExpenses}</p>
        </div>
        <div className="summary-card">
          <h3>Balance</h3>
          <p className="balance-amount">${balance}</p>
        </div>
      </div>

      {spendingByCategory.length > 0 && (
        <div className="chart-section">
          <h2>Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={spendingByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13}>
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                outerRadius={110}
                innerRadius={50}
                dataKey="value"
                paddingAngle={2}
              >
                {spendingByCategory.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="add-transaction">
        <h2>Add Transaction</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit">Add</button>
        </form>
      </div>

      <div className="transactions">
        <h2>Transactions</h2>
        <div className="filters">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.description}</td>
                <td>{t.category}</td>
                <td className={t.type === "income" ? "income-amount" : "expense-amount"}>
                  {t.type === "income" ? "+" : "-"}${t.amount}
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId !== null && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Transaction</h3>
            <p>Are you sure you want to delete this transaction?</p>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={cancelDelete}>Cancel</button>
              <button className="modal-delete-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
