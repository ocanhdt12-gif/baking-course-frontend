const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CHIEFS = [
  'f8c2c9fd-74d5-4cd4-985b-0f26a35b18e7',
  '1bf482cb-14b1-4ca6-94c5-5f380a1e371d',
  'b4cbb23c-eb7c-49fd-a29c-b097edae5ab5',
  '4545b11e-403d-47a6-8c3a-8a0c4672d204',
  '54fdf7b0-2157-4d40-a862-26d4eba8a9f7',
  '1b92fc54-5e22-493f-93bb-9611d420f300',
];

const THUMBNAILS = [
  'images/service/01.jpg', 'images/service/02.jpg', 'images/service/03.jpg',
  'images/service/04.jpg', 'images/service/05.jpg', 'images/service/06.jpg',
  'images/events/01.webp', 'images/events/02.webp', 'images/events/03.webp',
];

const VIDEO_COURSES = [
  {
    title: 'Nghệ Thuật Làm Bánh Mì Artisan',
    slug: 'nghe-thuat-banh-mi-artisan',
    description: 'Khóa học video toàn diện về kỹ thuật làm bánh mì thủ công cao cấp. Từ men tự nhiên (sourdough), bột chua, đến kỹ thuật tạo hình và nướng hoàn hảo. Học mọi lúc, mọi nơi với 12 video bài giảng chất lượng cao.',
    price: 29900,
    students: 234,
    reviews: 48,
    learningGoals: [
      { skill: 'Kỹ thuật nhào bột', percent: 90 },
      { skill: 'Men tự nhiên Sourdough', percent: 85 },
      { skill: 'Tạo hình bánh mì', percent: 80 },
      { skill: 'Kiểm soát nhiệt độ nướng', percent: 95 },
    ],
    classIncludes: [
      '12 video bài giảng HD',
      'Tài liệu PDF công thức chi tiết',
      'Truy cập vĩnh viễn',
      'Hỗ trợ qua nhóm Zalo',
    ],
    curriculum: [
      { title: 'Module 1: Nguyên liệu & Dụng cụ', content: 'Tổng quan về các loại bột mì, men, muối và dụng cụ cần thiết cho bánh mì artisan.' },
      { title: 'Module 2: Kỹ thuật nhào & Ủ bột', content: 'Các phương pháp nhào bột thủ công, kỹ thuật ủ lạnh qua đêm và ủ nóng.' },
      { title: 'Module 3: Tạo hình & Nướng', content: 'Cách tạo hình các loại bánh mì phổ biến, kỹ thuật rạch bánh và nướng trong lò gia đình.' },
    ],
    premiumContent: {
      videos: [
        { title: 'Bài 1 - Giới thiệu nguyên liệu', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Bài 2 - Nhào bột cơ bản', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Bài 3 - Sourdough Starter', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ],
      resources: [
        { title: 'Công thức Bánh mì Sourdough', url: '#' },
        { title: 'Bảng chuyển đổi đơn vị', url: '#' },
      ],
      guides: 'Hướng dẫn chi tiết từng bước làm bánh mì artisan hoàn hảo tại nhà. Bao gồm mẹo xử lý sự cố thường gặp.',
    },
  },
  {
    title: 'Chocolate Masterclass: Từ Cơ Bản Đến Nâng Cao',
    slug: 'chocolate-masterclass',
    description: 'Khám phá thế giới chocolate chuyên nghiệp qua 15 video bài giảng. Học cách temper chocolate, làm truffle, bonbon, ganache và các kỹ thuật trang trí cao cấp. Phù hợp cho cả người mới bắt đầu.',
    price: 45900,
    students: 189,
    reviews: 67,
    learningGoals: [
      { skill: 'Tempering chocolate', percent: 95 },
      { skill: 'Truffle & Bonbon', percent: 88 },
      { skill: 'Ganache flavoring', percent: 82 },
      { skill: 'Trang trí nghệ thuật', percent: 78 },
    ],
    classIncludes: [
      '15 video bài giảng chuyên sâu',
      'Bộ công thức 30+ loại chocolate',
      'Certificate hoàn thành khóa',
      'Hỗ trợ 1-1 qua chat',
    ],
    curriculum: [
      { title: 'Module 1: Cacao & Chocolate', content: 'Nguồn gốc cacao, quy trình sản xuất chocolate, phân biệt các loại chocolate.' },
      { title: 'Module 2: Tempering', content: 'Kỹ thuật tempering thủ công và bằng máy, kiểm tra nhiệt độ chính xác.' },
      { title: 'Module 3: Truffle & Bonbon', content: 'Làm truffle, bonbon với các loại nhân độc đáo. Kỹ thuật đổ khuôn polycarbonate.' },
      { title: 'Module 4: Trang trí', content: 'Tạo hoa văn, transfer sheet, spray gun và các kỹ thuật hoàn thiện chuyên nghiệp.' },
    ],
    premiumContent: {
      videos: [
        { title: 'Bài 1 - Thế giới Chocolate', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Bài 2 - Tempering cơ bản', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ],
      resources: [
        { title: 'Bảng nhiệt độ Tempering', url: '#' },
        { title: 'Công thức Ganache 10 hương vị', url: '#' },
      ],
      guides: 'Hướng dẫn chi tiết kỹ thuật tempering chocolate. Bao gồm bảng nhiệt độ cho Dark, Milk và White chocolate.',
    },
  },
  {
    title: 'Bếp Việt Truyền Thống: Phở & Bún',
    slug: 'bep-viet-pho-bun',
    description: 'Video hướng dẫn nấu Phở Bắc, Phở Nam, Bún Bò Huế và các món bún nước truyền thống Việt Nam. Bí quyết nấu nước dùng trong vắt, thơm lừng từ các đầu bếp lâu năm.',
    price: 19900,
    students: 456,
    reviews: 112,
    learningGoals: [
      { skill: 'Nước dùng Phở', percent: 95 },
      { skill: 'Bún Bò Huế', percent: 90 },
      { skill: 'Gia vị truyền thống', percent: 88 },
      { skill: 'Kỹ thuật thái thịt', percent: 75 },
    ],
    classIncludes: [
      '8 video bài giảng',
      'Công thức gia truyền',
      'Truy cập vĩnh viễn',
      'Nhóm cộng đồng Facebook',
    ],
    curriculum: [
      { title: 'Module 1: Phở Bắc truyền thống', content: 'Cách chọn xương, hầm nước dùng 12 tiếng, gia vị chuẩn vị Hà Nội.' },
      { title: 'Module 2: Phở Nam & Biến tấu', content: 'Phở kiểu Sài Gòn với rau thơm và tương, các biến tấu hiện đại.' },
      { title: 'Module 3: Bún Bò Huế', content: 'Bí quyết mắm ruốc, sả, ớt và nước dùng đậm đà chuẩn Huế.' },
    ],
    premiumContent: {
      videos: [
        { title: 'Phở Bắc - Nước dùng hoàn hảo', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Bún Bò Huế - Bí quyết gia vị', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ],
      resources: [
        { title: 'Công thức Phở Bắc', url: '#' },
      ],
      guides: 'Bí quyết nấu nước phở trong vắt: rang xương, chần xương, và thời gian hầm chính xác.',
    },
  },
  {
    title: 'Latte Art & Pha Chế Cà Phê Specialty',
    slug: 'latte-art-cafe-specialty',
    description: 'Khóa học video chuyên sâu về pha chế cà phê specialty. Từ cách chọn hạt, xay, chiết xuất espresso đến nghệ thuật Latte Art. Bao gồm 10 video thực hành và tài liệu kỹ thuật.',
    price: 34900,
    students: 167,
    reviews: 39,
    learningGoals: [
      { skill: 'Espresso extraction', percent: 92 },
      { skill: 'Latte Art cơ bản', percent: 85 },
      { skill: 'Latte Art nâng cao', percent: 70 },
      { skill: 'Cupping & tasting', percent: 80 },
    ],
    classIncludes: [
      '10 video bài giảng',
      'Sổ tay cupping PDF',
      'Truy cập vĩnh viễn',
      'Q&A trực tuyến hàng tháng',
    ],
    curriculum: [
      { title: 'Module 1: Hạt cà phê & Rang', content: 'Phân biệt Arabica, Robusta, các vùng trồng và mức rang.' },
      { title: 'Module 2: Espresso', content: 'Chiết xuất espresso hoàn hảo, điều chỉnh grind size, dose và yield.' },
      { title: 'Module 3: Latte Art', content: 'Kỹ thuật đánh sữa, rót tự do (free pour) với các hoa văn Heart, Tulip, Rosetta.' },
    ],
    premiumContent: {
      videos: [
        { title: 'Espresso - Chiết xuất chuẩn', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: 'Latte Art - Heart & Tulip', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      ],
      resources: [
        { title: 'Sổ tay Cupping', url: '#' },
        { title: 'Bảng chiết xuất Espresso', url: '#' },
      ],
      guides: 'Hướng dẫn latte art từ A-Z: cách đánh sữa micro-foam, góc nghiêng cốc, và tốc độ rót.',
    },
  },
];

const LIVE_CLASSES = [
  {
    title: 'Workshop Bánh Trung Thu Handmade',
    slug: 'workshop-banh-trung-thu',
    description: 'Lớp học trực tiếp tại xưởng: Tự tay làm bánh Trung Thu nhân thập cẩm và nhân đậu xanh trứng muối. Mỗi học viên mang về 4 chiếc bánh thành phẩm.',
    price: 55000,
    students: 24,
    reviews: 8,
    learningGoals: [
      { skill: 'Làm vỏ bánh nướng', percent: 90 },
      { skill: 'Nhân thập cẩm', percent: 85 },
      { skill: 'Kỹ thuật đóng khuôn', percent: 95 },
      { skill: 'Nướng & phun rượu', percent: 80 },
    ],
    classIncludes: [
      'Nguyên liệu được chuẩn bị sẵn',
      'Mang về 4 chiếc bánh thành phẩm',
      'Tạp dề & dụng cụ tại chỗ',
      'Ảnh chụp lưu niệm',
    ],
    curriculum: [
      { title: 'Phần 1: Làm vỏ bánh', content: 'Trộn bột, nghỉ bột, cán và chia phần vỏ bánh nướng.' },
      { title: 'Phần 2: Chuẩn bị nhân', content: 'Làm nhân thập cẩm truyền thống và nhân đậu xanh trứng muối.' },
      { title: 'Phần 3: Đóng khuôn & Nướng', content: 'Kỹ thuật bọc nhân, đóng khuôn và nướng 2 lần để bánh vàng đều.' },
    ],
    sessions: [
      { dayOfWeek: 'Saturday', timeRange: '09:00 AM - 12:00 PM', startDate: '2026-05-10T09:00:00Z', endDate: '2026-05-10T12:00:00Z' },
      { dayOfWeek: 'Sunday', timeRange: '14:00 PM - 17:00 PM', startDate: '2026-05-11T14:00:00Z', endDate: '2026-05-11T17:00:00Z' },
    ],
  },
  {
    title: 'Masterclass Sushi & Sashimi',
    slug: 'masterclass-sushi-sashimi',
    description: 'Lớp học trực tiếp với đầu bếp Nhật Bản: Kỹ thuật cắt cá sashimi, cuộn sushi maki/nigiri, pha trộn giấm sushi. Trải nghiệm thực hành 100% tại xưởng bếp chuyên nghiệp.',
    price: 75000,
    students: 18,
    reviews: 12,
    learningGoals: [
      { skill: 'Cắt cá Sashimi', percent: 88 },
      { skill: 'Nigiri Sushi', percent: 92 },
      { skill: 'Maki Roll', percent: 85 },
      { skill: 'Giấm Sushi & Nước chấm', percent: 78 },
    ],
    classIncludes: [
      'Cá tươi nhập khẩu',
      'Dao Yanagiba chuyên dụng',
      'Thưởng thức tại chỗ',
      'Chứng chỉ hoàn thành',
    ],
    curriculum: [
      { title: 'Phần 1: Cơm Sushi', content: 'Cách nấu cơm sushi, pha giấm và kỹ thuật quạt cơm chuẩn Nhật.' },
      { title: 'Phần 2: Kỹ thuật cắt cá', content: 'Phân biệt các loại cá, kỹ thuật cắt sashimi và fillet.' },
      { title: 'Phần 3: Tạo hình Sushi', content: 'Nigiri, Maki, Inside-out roll và kỹ thuật trang trí sushi.' },
    ],
    sessions: [
      { dayOfWeek: 'Wednesday', timeRange: '18:00 PM - 21:00 PM', startDate: '2026-05-07T18:00:00Z', endDate: '2026-05-07T21:00:00Z' },
      { dayOfWeek: 'Saturday', timeRange: '10:00 AM - 13:00 PM', startDate: '2026-05-17T10:00:00Z', endDate: '2026-05-17T13:00:00Z' },
    ],
  },
  {
    title: 'Zoom Live: Decorating Cake Fondant',
    slug: 'zoom-cake-fondant-decorating',
    description: 'Lớp học trực tuyến qua Zoom: Học cách phủ fondant mượt mà, tạo hoa hồng, lá và các chi tiết trang trí bánh kem. Giảng viên hướng dẫn trực tiếp, tương tác realtime.',
    price: 25000,
    students: 56,
    reviews: 22,
    learningGoals: [
      { skill: 'Phủ Fondant mượt', percent: 90 },
      { skill: 'Hoa hồng Fondant', percent: 85 },
      { skill: 'Viền & Chi tiết', percent: 80 },
      { skill: 'Phối màu', percent: 75 },
    ],
    classIncludes: [
      'Link Zoom gửi qua email',
      'Danh sách nguyên liệu chuẩn bị trước',
      'Recording buổi học',
      'Nhóm hỗ trợ sau khóa',
    ],
    curriculum: [
      { title: 'Buổi 1: Fondant cơ bản', content: 'Cách nhào fondant, phủ bánh đơn giản, xử lý nếp nhăn.' },
      { title: 'Buổi 2: Hoa & Lá', content: 'Tạo hoa hồng, lá, nụ bằng fondant. Kỹ thuật tạo cánh mỏng tự nhiên.' },
      { title: 'Buổi 3: Trang trí hoàn thiện', content: 'Phối hợp các chi tiết, viền bánh, chữ và hoàn thiện tác phẩm.' },
    ],
    sessions: [
      { dayOfWeek: 'Tuesday', timeRange: '19:30 PM - 21:00 PM', startDate: '2026-05-06T19:30:00Z', endDate: '2026-06-03T21:00:00Z', enrollmentDeadline: '2026-05-04T23:59:00Z' },
      { dayOfWeek: 'Thursday', timeRange: '19:30 PM - 21:00 PM', startDate: '2026-05-15T19:30:00Z', endDate: '2026-06-12T21:00:00Z', enrollmentDeadline: '2026-05-13T23:59:00Z' },
    ],
    premiumContent: {
      videos: [],
      resources: [
        { title: 'Danh sách nguyên liệu & dụng cụ', url: '#' },
      ],
      guides: '<h4>🔗 Link Phòng Zoom</h4>\n<p><strong>Link:</strong> https://zoom.us/j/1234567890</p>\n<p><strong>Passcode:</strong> CAKE2026</p>\n<p>Vui lòng tham gia đúng giờ theo lịch lớp đã chọn.</p>',
    },
  },
];

async function main() {
  console.log('🌱 Seeding programs...\n');

  // Seed VIDEO_COURSE programs
  for (let i = 0; i < VIDEO_COURSES.length; i++) {
    const vc = VIDEO_COURSES[i];
    const existing = await prisma.program.findUnique({ where: { slug: vc.slug } });
    if (existing) {
      console.log(`⏭️  Skip (exists): ${vc.title}`);
      continue;
    }
    await prisma.program.create({
      data: {
        title: vc.title,
        slug: vc.slug,
        programType: 'VIDEO_COURSE',
        description: vc.description,
        price: vc.price,
        students: vc.students,
        reviews: vc.reviews,
        thumbnail: THUMBNAILS[i % THUMBNAILS.length],
        chiefId: CHIEFS[i % CHIEFS.length],
        learningGoals: vc.learningGoals,
        classIncludes: vc.classIncludes,
        curriculum: vc.curriculum,
        premiumContent: vc.premiumContent,
      },
    });
    console.log(`✅ VIDEO_COURSE: ${vc.title}`);
  }

  // Seed LIVE_CLASS programs
  for (let i = 0; i < LIVE_CLASSES.length; i++) {
    const lc = LIVE_CLASSES[i];
    const existing = await prisma.program.findUnique({ where: { slug: lc.slug } });
    if (existing) {
      console.log(`⏭️  Skip (exists): ${lc.title}`);
      continue;
    }
    await prisma.program.create({
      data: {
        title: lc.title,
        slug: lc.slug,
        programType: 'LIVE_CLASS',
        description: lc.description,
        price: lc.price,
        students: lc.students,
        reviews: lc.reviews,
        thumbnail: THUMBNAILS[(i + 4) % THUMBNAILS.length],
        chiefId: CHIEFS[(i + 2) % CHIEFS.length],
        learningGoals: lc.learningGoals,
        classIncludes: lc.classIncludes,
        curriculum: lc.curriculum,
        premiumContent: lc.premiumContent || null,
        classSessions: {
          create: lc.sessions.map(s => ({
            dayOfWeek: s.dayOfWeek,
            timeRange: s.timeRange,
            startDate: new Date(s.startDate),
            endDate: new Date(s.endDate),
            enrollmentDeadline: s.enrollmentDeadline ? new Date(s.enrollmentDeadline) : null,
          })),
        },
      },
      include: { classSessions: true },
    });
    console.log(`✅ LIVE_CLASS: ${lc.title} (${lc.sessions.length} sessions)`);
  }

  console.log('\n🎉 Seeding hoàn tất!');

  // Summary
  const total = await prisma.program.count();
  const videoCount = await prisma.program.count({ where: { programType: 'VIDEO_COURSE' } });
  const liveCount = await prisma.program.count({ where: { programType: 'LIVE_CLASS' } });
  console.log(`📊 Tổng: ${total} programs (${videoCount} Video, ${liveCount} Trực tiếp)`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
