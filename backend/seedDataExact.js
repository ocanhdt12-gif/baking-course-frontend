const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seed exact data from index.html starting...');

  // Reset collections safely
  console.log('Cleaning up existing data (Except Users)...');
  await prisma.enrollment.deleteMany({});
  await prisma.classSession.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.chief.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.testimonial.deleteMany({});

  console.log('Cleanup completed!');

  // 1. Chiefs
  console.log('Seeding Chiefs...');
  const chiefsData = [
    { name: 'Alexander Lamb', role: 'Master Chef', image: 'images/team/01.jpg', email: 'alex@baking.com', bio: 'Master Chef specialized in International Cuisine.' },
    { name: 'Herbert Webster', role: 'Master Chef', image: 'images/team/02.jpg', email: 'herb@baking.com', bio: 'Expert in Fish, Meat & Poultry.' },
    { name: 'Hana Montgom', role: 'Master Chef', image: 'images/team/03.jpg', email: 'hana@baking.com', bio: 'Connoisseur of Exotic Cuisines.' },
    { name: 'Owen Bradley', role: 'Master Chef', image: 'images/team/04.jpg', email: 'owen@baking.com', bio: 'Master Chef of French Desserts.' },
    { name: 'Susie Perez', role: 'Assistant', image: 'images/team/05.jpg', email: 'susie@baking.com', bio: 'Assistant Chef specialized in Sushi & International.' },
    { name: 'Floyd Weaver', role: 'Master Chef', image: 'images/team/06.jpg', email: 'floyd@baking.com', bio: 'Sommelier and Seafood expert.' }
  ];

  const bioText = "Burgdoggen short ribs hamburger ball tip kevin alcatra capicola, ham pig pork belly flank strip steak salami. Pancetta fatback meatball sirloin cupim pork chop biltong. Jerky strip steak picanha kielbasa brisket tri-tip turkey landjaeger cupim.\n\nBresaola spare ribs sirloin leberkas beef venison bacon buffalo. Venison corned beef andouille, picanha boudin turducken tongue meatball burgdoggen prosciutto pork loin ribeye cupim shoulder tail. Capicola cow doner kielbasa pork.\n\nPork belly short loin jerky shank flank. Tenderloin ground round tri-tip flank chicken ribeye shoulder drumstick porchetta. Leberkas cupim sirloin, shankle jowl frankfurter venison ground round tail rump. T-bone cupim andouille burgdoggen.";
  const bioHTML = `<h4 class="mb-20">Biography:</h4>
<p>Venison tongue ribeye, ham hock shoulder ball tip filet mignon tri-tip leberkas landjaeger. Swine ribeye bresaola brisket tongue, ham doner biltong spare ribs pork belly cow capicola pork chop.</p>
<p>Corned beef strip steak. Meatloaf short loin chicken drumstick alcatra pork belly capicola bresaola turducken. Pork loin kielbasa short ribs, t-bone kevin shoulder drumstick picanha ball tip.</p>
<h4 class="mb-10 mt-40">Professional Life:</h4>
<p>Leberkas tongue drumstick landjaeger, jowl hamburger rump biltong short ribs buffalo corned beef. Flank capicola tongue, pig cupim ham hock tail rump chicken pork loin shankle prosciutto beef. Sausage pig short loin turkey short ribs venison, tongue tail pork.</p>`;
  const highlightsText = "Filet mignon tri-tip pig meatloaf jerky|Frankfurter turkey pork belly brisket kevin|Tail turducken beef short ribs porchetta";
  const skillsJSON = JSON.stringify([
    { name: "Consulting", percent: 25 },
    { name: "Finance", percent: 50 },
    { name: "Marketing", percent: 75 },
    { name: "Ferrum", percent: 100 }
  ]);

  const createdChiefs = [];
  for (const c of chiefsData) {
    const chief = await prisma.chief.create({
      data: {
        name: c.name, 
        role: c.role, 
        bio: bioText, 
        image: c.image === 'images/team/01.jpg' ? 'images/team/single-profile.jpg' : c.image,
        biography: bioHTML,
        highlights: highlightsText,
        skills: skillsJSON,
        socialFb: '#',
        socialTw: '#',
        socialIn: '#'
      }
    });
    createdChiefs.push(chief);
  }

  // 2. Programs
  console.log('Seeding Programs...');
  
  const pgrmTemplate = {
    classIncludes: ["Filet mignon tri-tip pig meatloaf jerky", "Frankfurter turkey pork belly brisket", "Tail turducken beef short ribs porchetta"],
    curriculum: [
      { title: "Bacon ipsum dolor amet tail?", content: "Bacon ipsum dolor amet boudin jerky chuck turkey tail shank andouille capicola shankle corned beef shoulder jowl." },
      { title: "Lorem ipsum dolor sit amet elit?", content: "Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et." }
    ],
    learningGoals: [
      { skill: "Consulting", percent: 25 },
      { skill: "Finance", percent: 50 },
      { skill: "Marketing", percent: 75 },
      { skill: "Ferrum", percent: 100 }
    ]
  };

  const programsData = [
    { title: 'Baking & Pastry', slug: 'baking-and-pastry', price: '550$', students: 18, reviews: 423, thumbnail: 'images/service/01.jpg', description: 'Capicola kielbasa pork belly cow alcatra pancetta rump sausage meatloaf burgdoggen.', chiefId: createdChiefs[0].id, authorImage: 'images/team/07.jpg' },
    { title: 'Fish, Meat & Poultry', slug: 'fish-meat-poultry', price: '480$', students: 23, reviews: 658, thumbnail: 'images/service/02.jpg', description: 'Venison prosciutto beef pork loin doner chuck sirloin filet mignon. Bresaola landjaeger chicken.', chiefId: createdChiefs[1].id, authorImage: 'images/team/08.jpg' },
    { title: 'Exotic Cuisines', slug: 'exotic-cuisines', price: '660$', students: 12, reviews: 359, thumbnail: 'images/service/03.jpg', description: 'Pig venison pork, leberkas biltong short loin beef ribs meatball bacon pastrami picanha drumstick.', chiefId: createdChiefs[2].id, authorImage: 'images/team/09.jpg' },
    { title: 'French Desserts', slug: 'french-desserts', price: '359$', students: 24, reviews: 259, thumbnail: 'images/service/04.jpg', description: 'Picanha andouille capicola doner, jerky swine alcatra cow landjaeger rump pastrami frankfurter.', chiefId: createdChiefs[3].id, authorImage: 'images/team/10.jpg' },
    { title: 'International Cuisine', slug: 'international-cuisine', price: '350$', students: 30, reviews: 751, thumbnail: 'images/service/05.jpg', description: 'Picanha pork belly rump, short ribs tail shankle tongue ham hock strip steak andouille. Tail short ribs.', chiefId: createdChiefs[4].id, authorImage: 'images/team/11.jpg' },
    { title: 'Seafood & Wine', slug: 'seafood-and-wine', price: '799$', students: 16, reviews: 469, thumbnail: 'images/service/06.jpg', description: 'Venison t-bone ham ham hock swine fatback, pastrami shankle kevin jerky chuck buffalo jowl beef.', chiefId: createdChiefs[5].id, authorImage: 'images/team/12.jpg' }
  ];

  const createdPrograms = {}; // slug -> id
  for (const p of programsData) {
    const prog = await prisma.program.create({
      data: {
        title: p.title, slug: p.slug, price: p.price,
        students: p.students, reviews: p.reviews,
        thumbnail: p.thumbnail, description: p.description,
        chiefId: p.chiefId, authorImage: p.authorImage,
        learningGoals: pgrmTemplate.learningGoals,
        classIncludes: pgrmTemplate.classIncludes,
        curriculum: pgrmTemplate.curriculum,
      }
    });
    createdPrograms[p.slug] = prog.id;
  }

  // 3. Class Sessions (Timetable)
  console.log('Seeding Class Sessions...');
  
  // Create a helper to quickly insert sessions across different days
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 10);
  const getFDate = (offset) => { const d = new Date(baseDate); d.setDate(d.getDate() + offset); return d; };

  const sessions = [
    { pid: createdPrograms['international-cuisine'], dayOfWeek: 'Sunday', timeRange: '09:00 am - 11:30 am', startDate: getFDate(0), endDate: getFDate(30), instructorOverride: 'Alexander Lamb' },
    { pid: createdPrograms['fish-meat-poultry'], dayOfWeek: 'Sunday', timeRange: '11:30 am - 01:15 pm', startDate: getFDate(5), endDate: getFDate(40), instructorOverride: 'Bert Webster' },
    { pid: createdPrograms['exotic-cuisines'], dayOfWeek: 'Sunday', timeRange: '01:15 pm - 04:30 pm', startDate: getFDate(7), endDate: getFDate(45), instructorOverride: 'Hana Montgom' },
    { pid: createdPrograms['french-desserts'], dayOfWeek: 'Sunday', timeRange: '04:30 pm - 07:00 pm', startDate: getFDate(14), endDate: getFDate(60), instructorOverride: 'Elen Bucnan' },
    
    { pid: createdPrograms['french-desserts'], dayOfWeek: 'Monday', timeRange: '09:00 am - 11:30 am', startDate: getFDate(2), endDate: getFDate(32), instructorOverride: 'Alexander Lamb' },
    { pid: createdPrograms['international-cuisine'], dayOfWeek: 'Monday', timeRange: '11:30 am - 01:15 pm', startDate: getFDate(4), endDate: getFDate(44), instructorOverride: 'Bert Webster' },
    { pid: createdPrograms['fish-meat-poultry'], dayOfWeek: 'Monday', timeRange: '01:15 pm - 04:30 pm', startDate: getFDate(8), endDate: getFDate(50), instructorOverride: 'Hana Montgom' },
    { pid: createdPrograms['exotic-cuisines'], dayOfWeek: 'Monday', timeRange: '04:30 pm - 07:00 pm', startDate: getFDate(12), endDate: getFDate(56), instructorOverride: 'Elen Bucnan' },

    { pid: createdPrograms['international-cuisine'], dayOfWeek: 'Tuesday', timeRange: '09:00 am - 11:30 am', startDate: getFDate(1), endDate: getFDate(31), instructorOverride: 'Alexander Lamb' },
    { pid: createdPrograms['fish-meat-poultry'], dayOfWeek: 'Tuesday', timeRange: '11:30 am - 01:15 pm', startDate: getFDate(3), endDate: getFDate(40), instructorOverride: 'Bert Webster' },
    { pid: createdPrograms['exotic-cuisines'], dayOfWeek: 'Tuesday', timeRange: '01:15 pm - 04:30 pm', startDate: getFDate(9), endDate: getFDate(45), instructorOverride: 'Hana Montgom' },
    { pid: createdPrograms['french-desserts'], dayOfWeek: 'Tuesday', timeRange: '04:30 pm - 07:00 pm', startDate: getFDate(10), endDate: getFDate(55), instructorOverride: 'Elen Bucnan' },
    
    // Wed to Sat mapped simply to fill the DB robustly
    { pid: createdPrograms['baking-and-pastry'], dayOfWeek: 'Wednesday', timeRange: '09:00 am - 11:30 am', startDate: getFDate(3), endDate: getFDate(33) },
    { pid: createdPrograms['seafood-and-wine'], dayOfWeek: 'Thursday', timeRange: '11:30 am - 01:15 pm', startDate: getFDate(5), endDate: getFDate(35) },
    { pid: createdPrograms['exotic-cuisines'], dayOfWeek: 'Friday', timeRange: '01:15 pm - 04:30 pm', startDate: getFDate(6), endDate: getFDate(36) },
    { pid: createdPrograms['international-cuisine'], dayOfWeek: 'Saturday', timeRange: '09:00 am - 11:30 am', startDate: getFDate(7), endDate: getFDate(37) }
  ];

  for(const s of sessions) {
    if(s.pid) {
      await prisma.classSession.create({
        data: {
          programId: s.pid,
          startDate: s.startDate,
          endDate: s.endDate,
          enrollmentDeadline: s.startDate,
          dayOfWeek: s.dayOfWeek,
          timeRange: s.timeRange,
          instructorOverride: s.instructorOverride || null,
        }
      });
    }
  }

  // 4. Testimonials
  console.log('Seeding Testimonials...');
  const tests = [
    { name: 'Lester Hodges', role: 'former student / Chef', text: 'Bacon tenderloin cupim spare ribs, leberkas sirloin andouille chicken brisket venison frankfurter pork meatball. Cow shoulder tongue buffalo.', signature: 'images/signature.png', excerpt: 'Capicola turkey jowl, sirloin tri-tip pastrami pig short ribs tenderloin jerky burgdoggen.' },
    { name: 'Alexander Lamb', role: 'former student / Chef', text: 'Maecenas odio odio, volutpat a tristique non, aliquam ac sem. Nam ultrices imperdiet lorem et volutpat. Suspendisse enim risus.', signature: 'images/signature.png', excerpt: 'Ellentesque hendrerit turpis eros, non rhoncus libero imperdiet ut. In rutrum lorem vel.' },
    { name: 'Floyd Weaver', role: 'former student / Chef', text: 'Vestibulum porttitor ante at sapien semper tincidunt. Suspendisse sagittis placerat diam nec tristique. Ut hendrerit urna et dui bibendum.', signature: 'images/signature.png', excerpt: 'Duis eu magna porttitor, sollicitudin nulla quis, lacinia elit. Etiam nec hendrerit turpis.' },
  ];
  for(const t of tests) {
    await prisma.testimonial.create({ data: t });
  }

  // 5. Posts
  console.log('Seeding Posts...');
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

  const categories = ['Recipes', 'Classes', 'Cook', 'Details', 'Kitchen'];
  const thumbnails = [
    'images/img-01.jpg', 'images/img-02.jpg', 'images/img-03.jpg', 
    'images/gallery/01.jpg', 'images/gallery/02.jpg', 'images/gallery/03.jpg',
    'images/gallery/04.jpg', 'images/gallery/05.jpg', 'images/gallery/06.jpg',
    'images/gallery/07.jpg', 'images/gallery/08.jpg', 'images/gallery/09.jpg',
    'images/gallery/10.jpg', 'images/gallery/11.jpg', 'images/gallery/12.jpg'
  ];

  const posts = [
    { title: 'How To Cook A Tender Juicy Steak', slug: 'how-to-cook-a-tender-juicy-steak', desc: 'Capicola kielbasa pork belly cow alcatra pancetta rump.', category: 'Recipes' },
    { title: 'How To Cook Turkey On Natural Gas Grills', slug: 'how-to-cook-turkey-on-natural-gas-grills', desc: 'Fatback meatloaf beef ribs, biltong frankfurter short ribs.', category: 'Recipes' },
    { title: 'How to make a fresh & natural healthy juice', slug: 'how-to-make-a-fresh-natural-healthy-juice', desc: 'Swine pork chop rump leberkas, venison doner landjaeger.', category: 'Recipes' },
    { title: 'Why Our Baking Classes Change Lives', slug: 'why-our-baking-classes-change-lives', desc: 'Discover how joining our classes can bring joy and mastery to your kitchen.', category: 'Classes' },
    { title: 'Choosing the Right Masterclass for You', slug: 'choosing-the-right-masterclass-for-you', desc: 'A guide to picking between pastry, exotic cuisines, and meat roasting.', category: 'Classes' },
    { title: 'Top 5 Skills Taught in Our Foundation Course', slug: 'top-5-skills-taught-in-our-foundation-course', desc: 'Learn the core techniques that will elevate your entire culinary journey.', category: 'Classes' },
    { title: 'Mastering the Art of the French Omelette', slug: 'mastering-the-art-of-the-french-omelette', desc: 'A step by step guide to creating the perfectly soft, buttery classic.', category: 'Cook' },
    { title: 'The Secret to Perfectly Seared Scallops', slug: 'the-secret-to-perfectly-seared-scallops', desc: 'Timing and temperature are everything when it comes to delicate seafood.', category: 'Cook' },
    { title: 'Slow Roasting Techniques for Ultimate Flavor', slug: 'slow-roasting-techniques-for-ultimate-flavor', desc: 'Patience pays off when breaking down tough cuts of meat.', category: 'Cook' },
    { title: 'Understanding Advanced Knife Skills', slug: 'understanding-advanced-knife-skills', desc: 'Julienne, brunoise, and chiffonade: the details that make a professional.', category: 'Details' },
    { title: 'The Chemistry of Perfect Dough', slug: 'the-chemistry-of-perfect-dough', desc: 'Why precise measurements and temperature control are vital for baking.', category: 'Details' },
    { title: 'Plating Like a Professional Chef', slug: 'plating-like-a-professional-chef', desc: 'Using negative space and color contrasts to make food look stunning.', category: 'Details' },
    { title: 'Essential Tools for a Modern Kitchen', slug: 'essential-tools-for-a-modern-kitchen', desc: 'The tools you actually need vs the gadgets you should avoid.', category: 'Kitchen' },
    { title: 'How to Organize Your Pantry for Efficiency', slug: 'how-to-organize-your-pantry-for-efficiency', desc: 'FIFO (First In, First Out) and other principles to keep ingredients fresh.', category: 'Kitchen' },
    { title: 'Maintaining Your Cast Iron Cookware', slug: 'maintaining-your-cast-iron-cookware', desc: 'Seasoning, cleaning, and caring for your most durable pans.', category: 'Kitchen' }
  ].map((p, idx) => ({
    ...p,
    thumbnail: thumbnails[idx % thumbnails.length],
    content: `<p>${p.desc}</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>`,
    createdAt: new Date(new Date('2018-01-19T00:00:00Z').getTime() + idx * 86400000)
  }));

  for(const pt of posts) {
    await prisma.post.create({
       data: {
         title: pt.title, slug: pt.slug, desc: pt.desc, content: pt.content, thumbnail: pt.thumbnail,
         authorId: admin ? admin.id : null, category: pt.category,
         createdAt: pt.createdAt
       }
    });
  }

  console.log('🎉 All 100% Mock Data Seeded Successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
