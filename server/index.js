import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    const { name, email, phone, password } = req.body;
    
    // Validate input
    if (!name || !email || !phone || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check for Supabase connection
    if (!supabase) {
      console.error('Supabase client not initialized');
      return res.status(500).json({ message: 'Database connection error' });
    }
    
    // Check if user already exists - fixing the query construction
    console.log('Checking for existing user with email:', email, 'or phone:', phone);
    const { data: existingUsers, error: queryError } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email},phone.eq.${phone}`);
    
    if (queryError) {
      console.error('Error checking existing user:', queryError);
      return res.status(500).json({ message: 'Error checking user existence', error: queryError });
    }
    
    if (existingUsers && existingUsers.length > 0) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }
    
    // Hash password
    console.log('Hashing password');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    console.log('Creating new user');
    const newUser = {
      name, 
      email, 
      phone, 
      password: hashedPassword,
      role: 'user' // Default role
    };
    
    console.log('Attempting to insert user into database:', { ...newUser, password: '[REDACTED]' });
    
    const { data: createdUser, error: insertError } = await supabase
      .from('users')
      .insert([newUser])
      .select();
    
    if (insertError) {
      console.error('Error creating user:', insertError);
      return res.status(500).json({ 
        message: 'Failed to create user in database',
        error: insertError.message,
        details: insertError.details
      });
    }
    
    if (!createdUser || createdUser.length === 0) {
      console.error('No user data returned after insert');
      return res.status(500).json({ message: 'User created but no data returned' });
    }
    
    const userRecord = createdUser[0];
    
    // Create token
    console.log('Creating JWT token for user ID:', userRecord.id);
    const token = jwt.sign(
      { id: userRecord.id, role: userRecord.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = userRecord;
    
    console.log('Registration successful for:', email);
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt with phone:', req.body.phone);
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      console.log('Missing phone or password');
      return res.status(400).json({ message: 'Phone and password are required' });
    }
    
    // Debug: Check all users in the system
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, name, email, phone, role');
    
    console.log('All users in the system:', allUsers);
    if (allUsersError) {
      console.error('Error fetching all users:', allUsersError);
    }
    
    // Find user with the provided phone
    console.log('Searching for user with phone:', phone);
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone);
    
    console.log('Query results:', { 
      found: users?.length > 0, 
      count: users?.length, 
      error: queryError 
    });
    
    if (queryError) {
      console.error('Error finding user:', queryError);
      return res.status(500).json({ message: 'Error finding user', error: queryError });
    }
    
    if (!users || users.length === 0) {
      console.log('No user found with phone:', phone);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    console.log('Found user:', { 
      id: user.id, 
      name: user.name, 
      role: user.role, 
      phone: user.phone,
      passwordExists: !!user.password 
    });
    
    // Check password
    console.log('Comparing passwords');
    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    console.log('Creating token for user ID:', user.id);
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('Login successful for user:', user.name, 'with role:', user.role);
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: error.message 
    });
  }
});

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    console.log('Fetching products...');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    console.log('Products response:', { data: data?.length || 0, error });
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    console.log(`Returning ${data?.length || 0} products`);
    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

app.post('/api/products', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('products')
      .insert([
        { name, description, price, category, image_url }
      ])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error adding product' });
  }
});

app.put('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;
    
    const { data, error } = await supabase
      .from('products')
      .update({ name, description, price, category, image_url })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
});

app.delete('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

// Order routes
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    console.log('Creating order with data:', {
      ...req.body,
      user_id: req.user.id
    });
    
    const { items, total } = req.body;
    const user_id = req.user.id;
    
    console.log('Authenticated user ID:', user_id);
    
    // Validate order data
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items data:', items);
      return res.status(400).json({ message: 'Invalid items data' });
    }
    
    if (total === undefined || total <= 0) {
      console.log('Invalid total:', total);
      return res.status(400).json({ message: 'Invalid total amount' });
    }
    
    // Generate a unique token (6 characters)
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log('Generated order token:', token);
    
    // Create order
    console.log('Attempting to insert order into database');
    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        { 
          user_id, 
          items, 
          total, 
          status: 'pending',
          token
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    console.log('Order created successfully:', order.id);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Server error creating order',
      error: error.message,
      details: error.details || 'No additional details'
    });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: order, error } = await supabase
      .from('orders')
      .select('*, user:users(name, phone)')
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is admin or the order belongs to the user
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

app.get('/api/orders/user', authenticateToken, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Admin routes
app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:users(name, phone)')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

app.put('/api/admin/orders/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'preparing', 'ready', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
});

app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get users with order count
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        orders:orders(id)
      `)
      .neq('role', 'admin');
    
    if (error) {
      throw error;
    }
    
    // Format response to include order count
    const formattedUsers = users.map(user => {
      const { orders, password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        order_count: orders.length
      };
    });
    
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

app.get('/api/admin/dashboard', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get stats
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*');
    
    if (ordersError) {
      throw ordersError;
    }
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .neq('role', 'admin');
    
    if (usersError) {
      throw usersError;
    }
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      throw productsError;
    }
    
    // Calculate stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const readyOrders = orders.filter(order => order.status === 'ready').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const totalUsers = users.length;
    const totalProducts = products.length;
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Get recent orders
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select('*, user:users(name, phone)')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentOrdersError) {
      throw recentOrdersError;
    }
    
    res.json({
      stats: {
        totalOrders,
        pendingOrders,
        readyOrders,
        completedOrders,
        totalUsers,
        totalProducts,
        revenue
      },
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

app.get('/api/admin/financials', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, user:users(name, phone)')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filter orders by date
    const todayOrders = orders.filter(order => new Date(order.created_at) >= todayStart);
    const weekOrders = orders.filter(order => new Date(order.created_at) >= weekStart);
    const monthOrders = orders.filter(order => new Date(order.created_at) >= monthStart);
    
    // Calculate stats
    const calculateStats = (orderList) => {
      const revenue = orderList.reduce((sum, order) => sum + order.total, 0);
      const orderCount = orderList.length;
      const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0;
      
      return {
        revenue,
        orderCount,
        averageOrderValue
      };
    };
    
    const stats = {
      today: calculateStats(todayOrders),
      thisWeek: calculateStats(weekOrders),
      thisMonth: calculateStats(monthOrders),
      allTime: calculateStats(orders)
    };
    
    // Get recent transactions (completed orders)
    const recentTransactions = orders.slice(0, 10);
    
    res.json({
      stats,
      recentTransactions
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ message: 'Server error fetching financial data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});