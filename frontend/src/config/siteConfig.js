import { ROUTES } from '../constants/routes';

export const siteConfig = {
  name: "Muka",
  logoText: "Muka",
  logoDot: ".",
  description: "Our Cooking School features a long and proud history of more than 100 years. Founded at the end of the XIXth century.",
  contact: {
    address: "828 Curtis Ferry, New York, USA",
    phone: "+8 (800) 238 3597 (admin)",
    email: "muka_office@example.com",
    website: "www.muka_cooking.com"
  },
  socials: {
    facebook: "#",
    twitter: "#",
    google: "#",
    youtube: "#"
  },
  copyrightYear: new Date().getFullYear(),
  heroSliderInterval: 7000, // Duration in milliseconds before auto-sliding
  header: {
    ctaButtonText: "Visit workshop",
    ctaButtonLink: "#classes"
  },
  footer: {
    newsletterTitle: "Subscribe Now",
    newsletterDescription: "Enter Email here to be updated. We promise not to send you spam!"
  },
  about: {
    historyParagraphs: [
      'Fatback kevin pig, buffalo tenderloin alcatra ground round tongue tail biltong bacon ham hock. Biltong flank burgdoggen pork chop, ham hock meatloaf tenderloin swine capicola filet mignon. Shoulder pancetta buffalo shank strip steak t-bone pastrami jerky shankle.',
      'Pork belly turkey chicken pastrami shoulder andouille swine pig. Corned beef pork belly ribeye turducken tongue venison. Brisket rump ribeye leberkas chicken meatball sausage pork loin bresaola. Short loin ribeye hamburger chicken bresaola porchetta cupim.'
    ],
    historyFeatures: [
      'Filet mignon tri-tip pig meatloaf jerky',
      'Frankfurter turkey pork belly brisket kevin',
      'Tail turducken beef short ribs porchetta',
      'Pork loin landjaeger t-bone shoulder'
    ],
    achievements: [
      {
        icon: 'fa-trophy',
        title: 'We Are Winners of 50 Competitions',
        desc: 'Salami corned beef short loin sausage meatloaf fatback andouille kielbasa frankfurter sirloin alcatra beef ribs.'
      },
      {
        icon: 'fa-group',
        title: '27 Professional Chefs-Trainers',
        desc: 'Ham hock jerky tail kevin, buffalo shoulder doner venison leberkas pig beef burgdoggen flank ribeye picanha burgdoggen.'
      },
      {
        icon: 'fa-hourglass-half',
        title: 'Guaranteed Fast Employment',
        desc: 'Ball tip landjaeger pork chop, kielbasa shank filet mignon cow burgdoggen cupim buffalo porchetta. Ribeye beef ribs flank.'
      }
    ]
  },
  sidebar: {
    categories: [
      { name: 'Recipes', count: null, link: ROUTES.RECEIPT },
      { name: 'Classes', count: null, link: ROUTES.RECEIPT },
      { name: 'Cook', count: null, link: ROUTES.RECEIPT },
      { name: 'Kitchen', count: null, link: ROUTES.RECEIPT },
      { name: 'Baking', count: null, link: ROUTES.RECEIPT }
    ],
    tags: [
      'Beef', 'Baking', 'Recipes', 'Cook', 'Kitchen', 'Classes', 'Pastry', 'Healthy', 'Menu'
    ]
  }
};
