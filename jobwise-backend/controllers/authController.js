import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('📥 Login attempt:', { email, password });

    if (!email || !password) {
      console.warn('❗ Missing login fields');
      return res.status(400).json({ msg: 'Email and password are required' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ Missing JWT_SECRET in .env');
      return res.status(500).json({ msg: 'Server config error' });
    }

    // In real app: lookup user + compare hashed password
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log('✅ Login success:', email);
    res.json({ token });
  } catch (err) {
    console.error('💥 Login error:', err);
    res.status(500).json({ msg: 'Login failed internally' });
  }
};

export const registerUser = async (req, res) => {
  try {
    console.log('🔔 Incoming register payload:', req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.warn('❗Missing fields:', { name, email, password });
      return res.status(400).json({ msg: 'All fields are required' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ Missing JWT_SECRET in .env');
      return res.status(500).json({ msg: 'Server config error' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    console.log('✅ Signup success:', email);
    res.status(201).json({ token });

  } catch (err) {
    console.error('💥 Signup error:', err);
    res.status(500).json({ msg: 'Signup failed internally' });
  }
};

export const logoutUser = async (req, res) => {
  res.json({ msg: 'Logout successful (client should clear token)' });
};

export const getMe = async (req, res) => {
  res.json({ msg: 'User fetched successfully', user: req.user });
};
