const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get unique programs that have schedule attributes mapped mapped as Timetables
exports.getAllTimetables = async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      where: {
        AND: [
          { dayOfWeek: { not: null } },
          { dayOfWeek: { not: "" } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Using mapping to format it exactly like the previous timetable
    const schedules = programs.map(p => ({
      id: p.id,
      dayOfWeek: p.dayOfWeek,
      title: p.title,
      dateRange: p.startDate ? new Date(p.startDate).toLocaleDateString() : 'Available Soon',
      timeRange: p.timeRange || '',
      instructor: p.authorName || '',
      image: p.thumbnail,
      slug: p.slug
    }));

    res.json(schedules);
  } catch (error) {
    console.error("Fetch Timetables err", error);
    res.status(500).json({ error: "Failed to fetch timetables" });
  }
};
