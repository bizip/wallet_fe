import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { fetchData } from '../hooks/api';
import { useAuthContext } from '../context/AuthContext';

const Home = () => {
  const [showForm, setShowForm] = useState(false);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken
  } = useAuthContext();
  
  useEffect(() => {
    const getData = async () => {
      const token = await getToken()
      const { data: fetchedData, loading: isLoading, error: fetchError } = await fetchData('/transactions', token);
      setData(fetchedData);
      setLoading(isLoading);
      setError(fetchError);
    };

    getData(); 
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for submitting the form data
    console.log(formData);
    setShowForm(false); // Hide the form after submission
  };

  return (
    <div className='pt-32 m-8'>
      <NavBar />
      <div className="p-4">
      <div className='w-full flex justify-end'>
  <button
    className="px-2 py-1 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
    onClick={() => setShowForm(!showForm)}
  >
    {showForm ? 'Cancel' : 'Add New Transaction'}
  </button>
</div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <div className="flex flex-col">
              <label htmlFor="id" className="font-semibold">Transaction ID</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

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
                <option value="expanse">Expense</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="category" className="font-semibold">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="subcategory" className="font-semibold">Subcategory</label>
              <input
                type="text"
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="account" className="font-semibold">Account</label>
              <input
                type="text"
                id="account"
                name="account"
                value={formData.account}
                onChange={handleChange}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
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
