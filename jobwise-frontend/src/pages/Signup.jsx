import React, { useState } from 'react';
import api from '../api';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', form);
      alert('Signup successful');
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
      <input name="role" placeholder="Role" value={form.role} onChange={handleChange} />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
