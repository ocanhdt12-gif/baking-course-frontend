const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateSlug = (title) => {
  if (!title) return `program-${Date.now()}`;
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
};

exports.getAllPrograms = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 10;
    const { dayOfWeek, chiefId } = req.query;

    const where = {};
    if (dayOfWeek) {
      where.classSessions = {
        some: { dayOfWeek }
      };
    }
    if (chiefId) {
      where.chiefId = chiefId;
    }

    if (page) {
      const skip = (page - 1) * limit;
      const totalItems = await prisma.program.count({ where });
      const programs = await prisma.program.findMany({
        where,
        skip,
        take: limit,
        include: { chief: true, classSessions: { include: { enrollments: true } } },
      });
      return res.json({
        data: programs,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        totalItems
      });
    }

    const programs = await prisma.program.findMany({
      where,
      include: { chief: true, classSessions: { include: { enrollments: true } } },
    });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching programs' });
  }
};

exports.getProgramByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    const jwt = require('jsonwebtoken');
    
    // Try to find by slug first
    let program = await prisma.program.findUnique({ 
      where: { slug: identifier },
      include: { chief: true, classSessions: true } 
    });
    
    // If not found, it might be an ID
    if (!program) {
      program = await prisma.program.findUnique({ 
        where: { id: identifier },
        include: { chief: true, classSessions: true }
      });
    }

    if (!program) return res.status(404).json({ error: 'Program not found' });

    // Content gating: check if user has purchased this program
    let hasPurchased = false;
    let orderStatus = null;
    
    // Try to extract user from token (optional — don't require auth)
    const token = req.header('x-auth-token') || 
      (req.header('Authorization')?.startsWith('Bearer ') ? req.header('Authorization').split(' ')[1] : null);
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_123');
        const userId = decoded.user?.id;
        
        if (userId) {
          const order = await prisma.order.findFirst({
            where: { userId, programId: program.id },
            orderBy: { createdAt: 'desc' }
          });
          
          if (order) {
            orderStatus = order.status;
            hasPurchased = order.status === 'CONFIRMED';
          }
        }
      } catch (e) {
        // Invalid token — just treat as guest
      }
    }

    // Build response
    const response = {
      ...program,
      hasPurchased,
      orderStatus, // null, PENDING, AWAITING_CONFIRM, CONFIRMED, REJECTED, CANCELLED
    };

    // Strip premiumContent if not purchased
    if (!hasPurchased) {
      response.premiumContent = null;
    }

    res.json(response);
  } catch (error) {
    console.error('getProgramByIdOrSlug error:', error);
    res.status(500).json({ error: 'Failed to fetch program details' });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const { title, description, price, thumbnail, slug, authorName, authorImage, learningGoals, classIncludes, curriculum, classSessions, chiefId, premiumContent, programType } = req.body;
    const finalSlug = slug || generateSlug(title);
    
    // Create nested classSessions
    const nestedSessions = classSessions && Array.isArray(classSessions) ? {
      create: classSessions.map(cs => ({
        startDate: cs.startDate ? new Date(cs.startDate) : null,
        endDate: cs.endDate ? new Date(cs.endDate) : null,
        enrollmentDeadline: cs.enrollmentDeadline ? new Date(cs.enrollmentDeadline) : null,
        dayOfWeek: cs.dayOfWeek || null,
        timeRange: cs.timeRange || null,
        instructorOverride: cs.instructorOverride || null,
      }))
    } : undefined;

    const program = await prisma.program.create({
      data: {
        title,
        slug: finalSlug,
        description,
        price: price != null ? parseInt(price) : null,
        thumbnail,
        chiefId: chiefId || null,
        programType: programType || 'LIVE_CLASS',
        authorName,
        authorImage,
        learningGoals: learningGoals || null,
        classIncludes: classIncludes || null,
        curriculum: curriculum || null,
        premiumContent: premiumContent || null,
        isFeatured: req.body.isFeatured || false,
        classSessions: nestedSessions
      },
      include: {
        classSessions: true
      }
    });
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while creating program' });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnail, slug, authorName, authorImage, learningGoals, classIncludes, curriculum, classSessions, chiefId, premiumContent, programType } = req.body;
    
    const finalSlug = slug || (title ? generateSlug(title) : undefined);

    let program = await prisma.program.update({
      where: { id },
      data: {
        title,
        ...(finalSlug && { slug: finalSlug }),
        description,
        price: price != null ? parseInt(price) : undefined,
        thumbnail,
        chiefId: chiefId || null,
        authorName,
        authorImage,
        ...(learningGoals !== undefined && { learningGoals }),
        ...(classIncludes !== undefined && { classIncludes }),
        ...(curriculum !== undefined && { curriculum }),
        ...(premiumContent !== undefined && { premiumContent }),
        ...(req.body.isFeatured !== undefined && { isFeatured: req.body.isFeatured }),
        ...(programType !== undefined && { programType })
      },
      include: {
        classSessions: true
      }
    });

    // If classSessions is provided, we overwrite current sessions
    if (classSessions && Array.isArray(classSessions)) {
      // Delete old sessions
      await prisma.classSession.deleteMany({
        where: { programId: id }
      });
      // Insert new sessions
      if (classSessions.length > 0) {
        await prisma.classSession.createMany({
          data: classSessions.map(cs => ({
            programId: id,
            startDate: cs.startDate ? new Date(cs.startDate) : null,
            endDate: cs.endDate ? new Date(cs.endDate) : null,
            enrollmentDeadline: cs.enrollmentDeadline ? new Date(cs.enrollmentDeadline) : null,
            dayOfWeek: cs.dayOfWeek || null,
            timeRange: cs.timeRange || null,
            instructorOverride: cs.instructorOverride || null,
          }))
        });
      }
      
      program = await prisma.program.findUnique({
        where: { id },
        include: { classSessions: true }
      });
    }
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update program' });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.program.delete({ where: { id } });
    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete program' });
  }
};

exports.getUpcomingPrograms = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const now = new Date();

    const programs = await prisma.program.findMany({
      where: {
        classSessions: { some: { startDate: { gte: now } } }
      },
      include: { classSessions: true },
      take: limit,
    });

    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming programs' });
  }
};

exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    
    if (isFeatured) {
      // 1. Check if the program is upcoming
      const targetProgram = await prisma.program.findUnique({ 
        where: { id },
        include: { classSessions: true }
      });
      if (!targetProgram) return res.status(404).json({ error: 'Program not found' });
      
      const hasUpcomingSession = targetProgram.classSessions && targetProgram.classSessions.some(cs => cs.startDate && new Date(cs.startDate) > new Date());

      if (!hasUpcomingSession) {
        return res.status(400).json({ error: 'Cannot feature a program that has no upcoming classes.' });
      }

      // 2. Check if we already have 3 featured programs
      const featuredCount = await prisma.program.count({ where: { isFeatured: true } });
      if (featuredCount >= 3) {
        return res.status(400).json({ error: 'Maximum of 3 programs can be featured.' });
      }
    }
    
    const program = await prisma.program.update({
      where: { id },
      data: { isFeatured: Boolean(isFeatured) }
    });
    
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle featured status' });
  }
};

exports.getTimetable = async (req, res) => {
  try {
    const classSessions = await prisma.classSession.findMany({
      include: {
        program: {
          select: { id: true, title: true, slug: true, price: true, thumbnail: true }
        }
      },
      orderBy: { startDate: 'asc' }
    });
    res.json(classSessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timetables' });
  }
};
