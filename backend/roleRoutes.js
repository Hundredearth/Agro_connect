const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ---------- Profile fetch routes ----------
router.get('/profile/farmer/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await prisma.farmer.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: 'Farmer profile not found' });
    res.json(profile);
  } catch (e) {
    console.error('Fetch farmer profile error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/profile/seller/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await prisma.seller.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: 'Seller profile not found' });
    res.json(profile);
  } catch (e) {
    console.error('Fetch seller profile error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/profile/customer/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await prisma.customer.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: 'Customer profile not found' });
    res.json(profile);
  } catch (e) {
    console.error('Fetch customer profile error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Role list for a user ----------
router.get('/users/:userId/roles', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const roles = [];
    const [farmer, seller, customer] = await Promise.all([
      prisma.farmer.findUnique({ where: { userId } }),
      prisma.seller.findUnique({ where: { userId } }),
      prisma.customer.findUnique({ where: { userId } })
    ]);
    if (farmer) roles.push('farmer');
    if (seller) roles.push('seller');
    if (customer) roles.push('customer');
    res.json({ roles });
  } catch (e) {
    console.error('User roles error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Seller product CRUD ----------
router.get('/seller/:sellerId/products', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await prisma.sellerProduct.findMany({ where: { sellerId } });
    res.json(products);
  } catch (e) {
    console.error('Get seller products error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/seller/:sellerId/products', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { name, description, price, stock, imageUrl } = req.body;
    const product = await prisma.sellerProduct.create({
      data: { sellerId, name, description, price, stock, imageUrl }
    });
    res.json(product);
  } catch (e) {
    console.error('Create seller product error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/seller/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await prisma.sellerProduct.update({ where: { id }, data: updates });
    res.json(product);
  } catch (e) {
    console.error('Update seller product error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/seller/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sellerProduct.delete({ where: { id } });
    res.json({ success: true, message: 'Seller product deleted' });
  } catch (e) {
    console.error('Delete seller product error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
