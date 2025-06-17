// components/AdminRegisterClient.jsx
import { useState } from 'react';


const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AdminRegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'client',
    company: '',
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const token = localStorage.getItem('token'); // or from context

      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // admin auth
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setMessage(`✅ User registered with ID: ${data.userId}`);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Register New User</h2>

      <input
        type="email"
        name="email"
        placeholder="User Email"
        required
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        value={formData.password}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="client">Client</option>
        <option value="admin">Admin</option>
      </select>

      <input
        type="text"
        name="company"
        placeholder="Company Name"
        required
        value={formData.company}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Register User
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
};

export default AdminRegisterForm;
