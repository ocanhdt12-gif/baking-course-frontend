require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ errorFormat: 'minimal' });

const MOCK_DATA = {
  slider: [
    {
      image: 'images/slide01.jpg',
      titleHighlight: 'Cooking is Easy, We Will Prove it to You!',
      titleMain: 'Next Cooking Class Starts In:',
      btnLink: '#',
      btnText: 'enroll now'
    },
    {
      image: 'images/slide02.jpg',
      titleHighlight: 'Cooking is Easy, We Will Prove it to You!',
      titleMain: 'Next Cooking Class Starts In:',
      btnLink: '#',
      btnText: 'enroll now'
    },
    {
      image: 'images/slide03.jpg',
      titleHighlight: 'Cooking is Easy, We Will Prove it to You!',
      titleMain: 'Next Cooking Class Starts In:',
      btnLink: '#',
      btnText: 'enroll now'
    }
  ],
  timetables: [
    { dayOfWeek: "Sunday", title: "International Cuisine from Alexander Lamb", dateRange: "19 jan - 25 feb, 2018", timeRange: "09:00 am - 11:30 am", instructor: "Alexander Lamb", image: "images/gallery/02.jpg" },
    { dayOfWeek: "Sunday", title: "Fish, Meat & Poultry", dateRange: "31 jan - 05 mar, 2018", timeRange: "11:30 am - 01:15 pm", instructor: "Bert Webster", image: "images/gallery/01.jpg" },
    { dayOfWeek: "Monday", title: "Secrets of French Desserts", dateRange: "19 jan - 25 feb, 2018", timeRange: "09:00 am - 11:30 am", instructor: "Alexander Lamb", image: "images/gallery/03.jpg" },
    { dayOfWeek: "Tuesday", title: "Exotic Cuisine for Connoisseurs of Exotics", dateRange: "31 jan - 20 feb, 2018", timeRange: "01:15 pm - 04:30 pm", instructor: "Hana Montgom", image: "images/gallery/10.jpg" }
  ],
  programs: [
    {
      id: 1,
      image: 'images/service/01.jpg',
      title: 'Baking & Pastry',
      price: 55000,
      reviews: 423,
      students: 18,
      desc: 'Capicola kielbasa pork belly cow alcatra pancetta rump sausage meatloaf burgdoggen.',
      authorName: 'Alexander Lamb',
      authorImage: 'images/team/07.jpg',
      slug: 'program-1-baking'
    },
    {
      id: 2,
      image: 'images/service/02.jpg',
      title: 'Fish, Meat & Poultry',
      price: 48000,
      reviews: 658,
      students: 23,
      desc: 'Venison prosciutto beef pork loin doner chuck sirloin filet mignon. Bresaola landjaeger chicken.',
      authorName: 'Herbert Webster',
      authorImage: 'images/team/08.jpg',
      slug: 'program-2-fish'
    },
    {
      id: 3,
      image: 'images/service/03.jpg',
      title: 'Exotic Cuisines',
      price: 66000,
      reviews: 359,
      students: 12,
      desc: 'Pig venison pork, leberkas biltong short loin beef ribs meatball bacon pastrami picanha drumstick.',
      authorName: 'Hana Montgom',
      authorImage: 'images/team/09.jpg',
      slug: 'program-3-exotic'
    },
    {
      id: 4,
      image: 'images/service/04.jpg',
      title: 'French Desserts',
      price: 35900,
      reviews: 259,
      students: 24,
      desc: 'Picanha andouille capicola doner, jerky swine alcatra cow landjaeger rump pastrami frankfurter.',
      authorName: 'Owen Bradley',
      authorImage: 'images/team/10.jpg',
      slug: 'program-4-french'
    },
    {
      id: 5,
      image: 'images/service/05.jpg',
      title: 'International Cuisine',
      price: 35000,
      reviews: 751,
      students: 30,
      desc: 'Picanha pork belly rump, short ribs tail shankle tongue ham hock strip steak andouille. Tail short ribs.',
      authorName: 'Susie Perez',
      authorImage: 'images/team/11.jpg',
      slug: 'program-5-international'
    },
    {
      id: 6,
      image: 'images/service/06.jpg',
      title: 'Seafood & Wine',
      price: 79900,
      reviews: 469,
      students: 16,
      desc: 'Venison t-bone ham ham hock swine fatback, pastrami shankle kevin jerky chuck buffalo jowl beef.',
      authorName: 'Floyd Weaver',
      authorImage: 'images/team/12.jpg',
      slug: 'program-6-seafood'
    }
  ],
  chiefs: [
    {
      name: 'Alexander Lamb',
      role: 'Master Chef',
      image: 'images/team/01.jpg',
      socialFb: '#', socialTw: '#', socialIn: '#'
    },
    {
      name: 'Herbert Webster',
      role: 'Master Chef',
      image: 'images/team/02.jpg',
      socialFb: '#', socialTw: '#', socialIn: '#'
    },
    {
      name: 'Hana Montgom',
      role: 'Master Chef',
      image: 'images/team/03.jpg',
      socialFb: '#', socialTw: '#', socialIn: '#'
    },
    {
      name: 'Owen Bradley',
      role: 'Master Chef',
      image: 'images/team/04.jpg',
      socialFb: '#', socialTw: '#', socialIn: '#'
    },
    {
      name: 'Susie Perez',
      role: 'Assistant',
      image: 'images/team/05.jpg',
      socialFb: '#', socialTw: '#', socialIn: '#'
    },
    {
      name: 'Floyd Weaver',
      role: 'Master Chef',
      image: 'images/team/06.jpg',
      socialFb: '#', socialTw: '#', socialIn: '#'
    }
  ],
  blog: [
    {
      title: 'How To Cook A Tender Juicy Steak',
      dateString: '19 Jan, 18',
      dateIso: '2017-10-03T08:50:40+00:00',
      image: 'images/img-01.jpg',
      authorName: 'Admin',
      category: 'Recipes',
      content: 'Capicola kielbasa pork belly cow alcatra pancetta rump sausage meatloaf burgdoggen.',
      slug: 'blog-1'
    },
    {
      title: 'How To Cook Turkey On Natural Gas Grills',
      dateString: '23 Jan, 18',
      dateIso: '2017-10-03T08:50:40+00:00',
      image: 'images/img-02.jpg',
      authorName: 'Admin',
      category: 'Classes',
      content: 'Fatback meatloaf beef ribs, biltong frankfurter short ribs tri-tip jerky pork chop hank landjaeger.',
      slug: 'blog-2'
    },
    {
      title: 'The Importance Of Food Elements',
      dateString: '30 Jan, 18',
      dateIso: '2017-10-03T08:50:40+00:00',
      image: 'images/img-03.jpg',
      authorName: 'Admin',
      category: 'Coach',
      content: 'Venison porchetta turkey corned beef, beef ribs pork belly tail pork chop shank meatball spare ribs.',
      slug: 'blog-3'
    }
  ],
  testimonials: [
    {
      excerpt: 'Capicola turkey jowl, sirloin tri-tip pastrami pig short ribs tenderloin jerky burgdoggen.',
      text: 'Bacon tenderloin cupim spare ribs, leberkas sirloin andouille chicken brisket venison frankfurter pork meatball. Cow shoulder tongue buffalo. Doner turkey tenderloin ground round landjaeger corned beef drumstick kevin buffalo. Frankfurter porchetta ham hock short ribs.',
      name: 'Lester Hodges',
      role: 'former student / Chef'
    },
    {
      excerpt: 'Ellentesque hendrerit turpis eros, non rhoncus libero imperdiet ut. In rutrum lorem vel.',
      text: 'Maecenas odio odio, volutpat a tristique non, aliquam ac sem. Nam ultrices imperdiet lorem et volutpat. Suspendisse enim risus, blandit in velit sit amet, ultrices aliquet arcu. Aenean vestibulum risus eget urna eleifend ultrices. Integer lacinia vitae arcu eget laoreet.',
      name: 'Alexander Lamb',
      role: 'former student / Chef'
    },
    {
      excerpt: 'Duis eu magna porttitor, sollicitudin nulla quis, lacinia elit. Etiam nec hendrerit turpis.',
      text: 'Vestibulum porttitor ante at sapien semper tincidunt. Suspendisse sagittis placerat diam nec tristique. Ut hendrerit urna et dui bibendum, vel feugiat diam luctus. Aliquam scelerisque, sem vel condimentum ornare, libero sapien venenatis lorem, vitae bibendum nisi.',
      name: 'Floyd Weaver',
      role: 'former student / Chef'
    }
  ]
};

async function main() {
  console.log('Start seeding...');

  const upcomingDate1 = new Date();
  upcomingDate1.setDate(upcomingDate1.getDate() + 10); // 10 days from now
  
  const upcomingDate2 = new Date();
  upcomingDate2.setDate(upcomingDate2.getDate() + 15); // 15 days from now

  await prisma.classSession.deleteMany({});
  await prisma.program.deleteMany({});

  for (let i = 0; i < MOCK_DATA.programs.length; i++) {
    const program = MOCK_DATA.programs[i];
    
    // Feature first 3 programs
    const isFeatured = i < 3;

    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {},
      create: {
        slug: program.slug,
        title: program.title,
        price: program.price,
        description: program.desc,
        thumbnail: program.image,
        authorName: program.authorName,
        authorImage: program.authorImage,
        isFeatured: isFeatured,
        classSessions: {
          create: [
            {
              startDate: upcomingDate1,
              endDate: upcomingDate2,
              enrollmentDeadline: upcomingDate1,
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i % 7],
              timeRange: "10:00 AM - 12:00 PM",
            },
            {
              startDate: upcomingDate2,
              endDate: new Date(upcomingDate2.getTime() + 86400000 * 5),
              enrollmentDeadline: upcomingDate2,
              dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday"][i % 7],
              timeRange: "02:00 PM - 04:00 PM",
            }
          ]
        }
      },
    });
  }

  console.log('Seeded programs and class sessions.');

  await prisma.chief.deleteMany({});
  for (const chief of MOCK_DATA.chiefs) {
    await prisma.chief.create({
      data: chief,
    });
  }

  console.log('Seeded chiefs.');

  for (const post of MOCK_DATA.blog) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        content: post.content,
        thumbnail: post.image,
        desc: post.content,
        authorName: post.authorName,
        category: post.category,
        dateString: post.dateString,
        dateIso: new Date(post.dateIso)
      },
    });
  }

  console.log('Seeded posts.');

  await prisma.testimonial.deleteMany({});
  for (const t of MOCK_DATA.testimonials) {
    await prisma.testimonial.create({
      data: t,
    });
  }

  console.log('Seeded testimonials.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
