require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());

const roleRoutes = require('./roleRoutes');
app.use('/api', roleRoutes);

// Health check / root
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'AgroConnect API is running 🌱', version: '1.0.0' });
});

// --- Authentication & Profiles ---

// Register User & Initial Profile
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, fullName, phone, address, companyName, farmSize } = req.body;
    
    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: { email, password },
      });
    }

    // Create profile based on requested role
    let profile;
    if (role === 'farmer') {
      profile = await prisma.farmer.create({
        data: { userId: user.id, fullName, phone, address, farmSize },
      });
    } else if (role === 'seller') {
      profile = await prisma.seller.create({
        data: { userId: user.id, fullName, phone, address, companyName },
      });
    } else if (role === 'customer') {
      profile = await prisma.customer.create({
        data: { userId: user.id, fullName, phone, address },
      });
    } else {
      return res.status(400).json({ error: 'Invalid role specified' });
    }
    
    res.json({ user, profile, role });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Profile already exists for this role.' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});
// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Fetch associated profiles
    const [farmer, seller, customer] = await Promise.all([
      prisma.farmer.findUnique({ where: { userId: user.id } }),
      prisma.seller.findUnique({ where: { userId: user.id } }),
      prisma.customer.findUnique({ where: { userId: user.id } })
    ]);
    let role = null;
    let profile = null;
    if (farmer) { role = 'farmer'; profile = farmer; }
    else if (seller) { role = 'seller'; profile = seller; }
    else if (customer) { role = 'customer'; profile = customer; }
    res.json({ user, profile, role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Switch Role (Checks if profile exists, if not -> client should redirect to sign up with userId)
app.post('/api/auth/switch-role', async (req, res) => {
  try {
    const { userId, targetRole } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        sellerProfile: true,
        customerProfile: true
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    let profileExists = false;
    let profile = null;

    if (targetRole === 'farmer') {
      profileExists = !!user.farmerProfile;
      profile = user.farmerProfile;
    } else if (targetRole === 'seller') {
      profileExists = !!user.sellerProfile;
      profile = user.sellerProfile;
    } else if (targetRole === 'customer') {
      profileExists = !!user.customerProfile;
      profile = user.customerProfile;
    }

    res.json({ profileExists, profile, targetRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get User Profile Data
app.get('/api/users/:userId/profile/:role', async (req, res) => {
  try {
    const { userId, role } = req.params;
    let profile;
    if (role === 'farmer') profile = await prisma.farmer.findUnique({ where: { userId } });
    else if (role === 'seller') profile = await prisma.seller.findUnique({ where: { userId } });
    else if (role === 'customer') profile = await prisma.customer.findUnique({ where: { userId } });
    
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update User Profile Data
app.put('/api/users/:userId/profile/:role', async (req, res) => {
  try {
    const { userId, role } = req.params;
    const { fullName, phone, address, farmSize, companyName } = req.body;
    let profile;
    
    if (role === 'farmer') {
      profile = await prisma.farmer.update({
        where: { userId },
        data: { fullName, phone, address, farmSize }
      });
    } else if (role === 'seller') {
      profile = await prisma.seller.update({
        where: { userId },
        data: { fullName, phone, address, companyName }
      });
    } else if (role === 'customer') {
      profile = await prisma.customer.update({
        where: { userId },
        data: { fullName, phone, address }
      });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Farmer Produce Flow ---

// List all produce (for Customer Fresh Shop)
app.get('/api/produce', async (req, res) => {
  try {
    const produces = await prisma.produce.findMany({
      include: { farmer: true }
    });
    res.json(produces);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get produce by specific farmer
app.get('/api/produce/farmer/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const produces = await prisma.produce.findMany({
      where: { farmerId }
    });
    res.json(produces);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new produce (Farmer)
app.post('/api/produce', async (req, res) => {
  try {
    const { farmerId, name, description, price, stock, imageUrl } = req.body;
    const produce = await prisma.produce.create({
      data: { farmerId, name, description, price, stock, imageUrl }
    });
    res.json(produce);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete produce (Farmer)
app.delete('/api/produce/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.produce.delete({ where: { id } });
    res.json({ success: true, message: 'Produce deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// List all farmers (For Customer Farmers List)
app.get('/api/farmers', async (req, res) => {
  try {
    const farmers = await prisma.farmer.findMany();
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Purchase Requests (Customer to Farmer) ---

// Customer requests to buy produce
app.post('/api/purchase-requests', async (req, res) => {
  try {
    const { produceId, customerId, quantity } = req.body;
    const request = await prisma.purchaseRequest.create({
      data: { produceId, customerId, quantity, status: 'REQUESTED' }
    });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get requests for Farmer
app.get('/api/purchase-requests/farmer/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const requests = await prisma.purchaseRequest.findMany({
      where: {
        produce: { farmerId }
      },
      include: {
        produce: true,
        customer: true
      }
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update request status (Farmer approves)
app.patch('/api/purchase-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'APPROVED'
    const request = await prisma.purchaseRequest.update({
      where: { id },
      data: { status }
    });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Approved Orders for Customer (so they can pick up)
app.get('/api/orders/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await prisma.purchaseRequest.findMany({
      where: { customerId, status: 'APPROVED' },
      include: {
        produce: {
          include: { farmer: true } // Includes farmer contact & address
        }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Seller Product & Order Endpoints ---

// Get all seller products (with seller info, for Agri-Market)
app.get('/api/seller-products', async (req, res) => {
  try {
    const products = await prisma.sellerProduct.findMany({
      include: {
        seller: true
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Get seller-products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get seller's own products
app.get('/api/seller-products/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await prisma.sellerProduct.findMany({
      where: { sellerId }
    });
    res.json(products);
  } catch (error) {
    console.error('Get seller-products by seller error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new seller product
app.post('/api/seller-products', async (req, res) => {
  try {
    const { sellerId, name, description, price, stock, imageUrl } = req.body;
    const product = await prisma.sellerProduct.create({
      data: {
        sellerId,
        name,
        description,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        imageUrl
      }
    });
    res.json(product);
  } catch (error) {
    console.error('Create seller-product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update seller product
app.put('/api/seller-products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl } = req.body;
    const product = await prisma.sellerProduct.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        imageUrl
      }
    });
    res.json(product);
  } catch (error) {
    console.error('Update seller-product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete seller product
app.delete('/api/seller-products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sellerProduct.delete({ where: { id } });
    res.json({ success: true, message: 'Seller product deleted' });
  } catch (error) {
    console.error('Delete seller-product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Farmer places order for seller product
app.post('/api/seller-orders', async (req, res) => {
  try {
    const { sellerProductId, farmerId, quantity } = req.body;
    const order = await prisma.sellerOrder.create({
      data: {
        sellerProductId,
        farmerId,
        quantity: parseInt(quantity) || 1,
        status: 'PENDING'
      }
    });
    res.json(order);
  } catch (error) {
    console.error('Create seller-order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Seller sees incoming orders
app.get('/api/seller-orders/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const orders = await prisma.sellerOrder.findMany({
      where: {
        sellerProduct: { sellerId }
      },
      include: {
        sellerProduct: true,
        farmer: true
      }
    });
    res.json(orders);
  } catch (error) {
    console.error('Get seller-orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Farmer sees their own orders + status
app.get('/api/seller-orders/farmer/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const orders = await prisma.sellerOrder.findMany({
      where: { farmerId },
      include: {
        sellerProduct: {
          include: {
            seller: true
          }
        }
      }
    });
    res.json(orders);
  } catch (error) {
    console.error('Get farmer-orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Seller approves or rejects order
app.patch('/api/seller-orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. APPROVED, REJECTED
    const order = await prisma.sellerOrder.update({
      where: { id },
      data: { status }
    });
    
    // Decrement stock if approved
    if (status === 'APPROVED') {
      const sellerOrder = await prisma.sellerOrder.findUnique({
        where: { id },
        include: { sellerProduct: true }
      });
      if (sellerOrder && sellerOrder.sellerProduct) {
        const newStock = Math.max(0, sellerOrder.sellerProduct.stock - sellerOrder.quantity);
        await prisma.sellerProduct.update({
          where: { id: sellerOrder.sellerProductId },
          data: { stock: newStock }
        });
      }
    }
    
    res.json(order);
  } catch (error) {
    console.error('Update seller-order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- AI assistant chat ---
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, disease } = req.body;
    let responseText = "";
    const lowercaseMessage = message.toLowerCase();
    
    if (disease && disease !== "Analysis Failed" && disease !== "Unknown" && disease !== "Detected") {
      if (lowercaseMessage.includes("treatment") || lowercaseMessage.includes("fix") || lowercaseMessage.includes("cure") || lowercaseMessage.includes("pesticide") || lowercaseMessage.includes("fungicide")) {
        responseText = `To treat ${disease}, here is a highly effective treatment plan:
1. **Immediate Chemical Control**: Apply a standard fungicide containing Triazole or Strobulurin at 250ml per acre.
2. **Organic/Biological Control**: Use Bacillus subtilis or a 1% copper oxychloride spray to arrest spore propagation.
3. **Cultural Practice**: Prune heavily infected leaves and burn them to prevent field-wide drift. Avoid overhead watering to keep foliage dry.`;
      } else if (lowercaseMessage.includes("prevent") || lowercaseMessage.includes("stop") || lowercaseMessage.includes("avoid")) {
        responseText = `To prevent future outbreaks of ${disease}:
1. Use disease-resistant seed varieties certified by the local agricultural department.
2. Maintain crop rotation (e.g., rotate with legumes or brassicas) to break the pathogen lifecycle.
3. Manage humidity by optimizing plant spacing for maximum airflow and sun exposure.`;
      } else if (lowercaseMessage.includes("cause") || lowercaseMessage.includes("why")) {
        responseText = `${disease} is primarily caused by fungal pathogens that thrive in warm, highly humid conditions (relative humidity > 85%, temperature around 20-25°C). Spores travel via wind or water droplets.`;
      } else {
        responseText = `I have analyzed the scan for **${disease}**. 
To best help you, could you let me know:
- How widely has this spread across your field?
- Are you looking for immediate organic treatments or synthetic solutions?
- What are the current weather conditions (e.g. wet/humid or dry)?`;
      }
    } else {
      if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
        responseText = "Hello! I am AgroAI, your digital farming assistant. How can I help you improve crop yield or diagnose disease today?";
      } else if (lowercaseMessage.includes("crop") || lowercaseMessage.includes("soil") || lowercaseMessage.includes("fertilizer")) {
        responseText = "As your AgroAI assistant, I recommend maintaining a consistent soil test schedule, monitoring crop moisture, and applying fertilizer based on your specific crop guidelines. Let me know if you have any questions or upload a crop leaf scan to diagnose a specific disease!";
      } else {
        responseText = "Hello! I am here to help. Feel free to ask me questions about farming, soil management, or crop diseases. If you've just scanned a leaf, I can provide a specialized treatment plan!";
      }
    }
    
    res.json({ reply: responseText });
  } catch (error) {
    console.error('AI Assistant Chat error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Community Alert Reports ---

// Create a new community report
app.post('/api/reports', async (req, res) => {
  try {
    const { farmerId, type, title, description, latitude, longitude } = req.body;
    const report = await prisma.report.create({
      data: {
        farmerId,
        type,
        title,
        description,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null
      }
    });
    res.json(report);
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all reports from the last 24 hours
app.get('/api/reports', async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const reports = await prisma.report.findMany({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo
        }
      },
      include: {
        farmer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
