/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { fetchData } from '../hooks/api';
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    amount: '',
    type: '',
    category: '',
    subcategory: '',
    account: '',
    description: '',
    date: '',
  });

  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken
  } = useAuthContext();

  const [startDate, setStartDate] = useState(new Date('2023-01-01')); 
  const [endDate, setEndDate] = useState(new Date('2023-12-31')); // State for end date

  const accounts = [
    { id: 'bank1', name: 'Primary Bank Account', type: 'Bank' },
    { id: 'mobile1', name: 'Mobile Money', type: 'Mobile' },
    { id: 'cash1', name: 'Cash Wallet', type: 'Cash' },
    { id: 'savings1', name: 'Savings Account', type: 'Bank' }
  ];

  const categories = [
    { 
      id: 'food',
      name: 'Food & Dining',
      subcategories: [
        { id: 'grocery', name: 'Groceries' },
        { id: 'restaurant', name: 'Restaurants' },
        { id: 'delivery', name: 'Food Delivery' }
      ]
    },
    {
      id: 'transport',
      name: 'Transportation',
      subcategories: [
        { id: 'fuel', name: 'Fuel' },
        { id: 'public', name: 'Public Transport' },
        { id: 'taxi', name: 'Taxi' }
      ]
    },
    {
      id: 'utilities',
      name: 'Utilities',
      subcategories: [
        { id: 'electricity', name: 'Electricity' },
        { id: 'water', name: 'Water' },
        { id: 'internet', name: 'Internet' }
      ]
    },
    {
      id: 'income',
      name: 'Income',
      subcategories: [
        { id: 'salary', name: 'Salary' },
        { id: 'freelance', name: 'Freelance' },
        { id: 'investments', name: 'Investments' }
      ]
    }
  ];

  const getSubcategories = () => {
    const selectedCategory = categories.find(cat => cat.id === formData.category);
    return selectedCategory?.subcategories || [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === 'category' && { subcategory: '' })
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    setLoading(true); // Set loading to true
    setError(null); // Reset any previous error

    try {
      const token = await getToken();
      const response = await fetchData('/transactions', token, 'POST', formData); 
      console.log("response",response);
      if (response?.data.status !== 201) {
        throw new Error('Failed to submit transaction');
      }

      await fetchData('/transactions', token)
      setShowForm(!showForm)
    } catch (err) {
      setError(err); // Set error if the request fails
      console.error('Error submitting transaction:', err);
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  const generateReport = (transactions, startDate, endDate) => {
    const filteredTransactions = transactions?.filter(transaction => {
      const transactionDate = new Date(transaction.date._seconds * 1000); // Convert Firestore timestamp to Date
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    const totalIncome = filteredTransactions.reduce((acc, transaction) => {
      return transaction.type === 'income' ? acc + parseFloat(transaction.amount) : acc;
    }, 0);

    const totalExpense = filteredTransactions.reduce((acc, transaction) => {
      return transaction.type === 'expense' ? acc + parseFloat(transaction.amount) : acc;
    }, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  };

  useEffect(() => {
    const getData = async () => {
      const token = await getToken();
      const { data: fetchedData, loading: isLoading, error: fetchError } = await fetchData('/transactions', token);
      setData(fetchedData.transactions);
      setSummary(fetchedData.summary);
      setLoading(isLoading);
      setError(fetchError);

      // Generate report from fetched data based on the desired time gap
      const reportData = generateReport(fetchedData.transactions, startDate, endDate);
      setReport(reportData); // Set the generated report
    };

    getData(); 
  }, [startDate, endDate]); // Re-run effect when startDate or endDate changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  return (
    <div className='pt-32 m-8'>
      <NavBar />
      <div className="p-4">
      <div className='w-full flex justify-between'>
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold text-gray-700">Summary</h3>
        <div className="mt-2 flex justify-between text-gray-500">
          <div>
            <span className="font-semibold text-green-600">Income:</span> ${summary.income.toFixed(2)}
          </div>
          <div>
            <span className="font-semibold text-red-600 ml-4">Expense:</span> ${summary.expense.toFixed(2)}
          </div>
        </div>
        <div className="mt-4">
          <label className="font-semibold p-8">Select Date Range for generatin the report</label>
          <div className="flex space-x-4 p-4">
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]} // Format date for input
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="border rounded-lg p-2"
            />
            <input
              type="date"
              value={endDate.toISOString().split('T')[0]} // Format date for input
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="border rounded-lg p-2"
            />
          </div>
        </div>
        {report && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-700">Report</h4>
            <div className="text-gray-500">
              <p>Total Income: ${report.totalIncome.toFixed(2)}</p>
              <p>Total Expense: ${report.totalExpense.toFixed(2)}</p>
              <p>Balance: ${report.balance.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
  <button
    className=" bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 "
    style={{
      padding: '2px 4px',  maxHeight: '50px'}}

    onClick={() => setShowForm(!showForm)}
  >
    {showForm ? 'Cancel' : 'Add New Transaction'}
  </button>
</div>

       {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div className="flex flex-col">
            <label htmlFor="amount" className="font-semibold">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="type" className="font-semibold">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="account" className="font-semibold">Account</label>
            <select
              id="account"
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.type})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="category" className="font-semibold">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="subcategory" className="font-semibold">Subcategory</label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              disabled={!formData.category}
            >
              <option value="">Select Subcategory</option>
              {getSubcategories().map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="font-semibold">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="date" className="font-semibold">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </form>
      )}
      </div>
      {!showForm && Object.values(data) && Object.values(data).length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          No transactions available.
        </div>
      )}
      {!showForm && Object.values(data).length > 0  && <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Transaction ID</th>
              <th scope="col" className="px-6 py-3">Amount</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Subcategory</th>
              <th scope="col" className="px-6 py-3">Account</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(data).map((entry, index) => {
              if (entry.id) {
                const date = new Date(entry.date._seconds * 1000).toLocaleDateString();
                return (
                  <tr key={entry.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-6 py-4">{entry.id}</td>
                    <td className="px-6 py-4">${entry.amount}</td>
                    <td className={`px-6 py-4 ${entry.type === 'income' ? 'text-blue-500' : 'text-red-500'}`}>
                        {entry.type}
                    </td>
                    <td className="px-6 py-4">{entry.category}</td>
                    <td className="px-6 py-4">{entry.subcategory}</td>
                    <td className="px-6 py-4">{entry.account}</td>
                    <td className="px-6 py-4">{entry.description}</td>
                    <td className="px-6 py-4">{date}</td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>}
    </div>
  );
};

export default Home;
