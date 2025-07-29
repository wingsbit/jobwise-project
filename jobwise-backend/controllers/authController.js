import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const createToken = (userId) => {
  return jwt.sign({ id: userId }, 'secret123', { expiresIn: '3d' });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already exists' });

    const user = await User.create({ name, email, password, role });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ msg: 'Signup successful', user });
  } catch (err) {
    res.status(400).json({ msg: 'Signup failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ msg: 'Login successful', user });
  } catch (err) {
    res.status(400).json({ msg: 'Login failed', error: err.message });
  }
};
