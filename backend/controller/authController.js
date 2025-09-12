import User from '../models/User.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // For now, we'll just save the user, in a real app you'd check if the user exists and the password is correct
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'User saved' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving user', error });
  }
};
