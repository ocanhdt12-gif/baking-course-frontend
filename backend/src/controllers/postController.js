const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateSlug = (title) => {
  if (!title) return `post-${Date.now()}`;
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
};

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;

    if (page) {
      const skip = (page - 1) * limit;
      const totalItems = await prisma.post.count();
      const posts = await prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      });
      return res.json({
        data: posts,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        totalItems
      });
    }

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching posts' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.post.findMany({
      where: { category: { not: null } },
      distinct: ['category'],
      select: { category: true }
    });
    res.json(categories.map(c => c.category).filter(Boolean));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.getPostByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    let post = await prisma.post.findUnique({ where: { slug: identifier } });
    
    if (!post) {
      post = await prisma.post.findUnique({ where: { id: identifier } });
    }

    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post details' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.slug) {
      payload.slug = generateSlug(payload.title);
    }
    const post = await prisma.post.create({ data: payload });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.slug && payload.title) {
      payload.slug = generateSlug(payload.title);
    }
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: payload
    });
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
