const fs = require('fs');

let homeContent = fs.readFileSync('/Users/hoangkien/NLV/baking/frontend/src/pages/Home.jsx', 'utf8');

const components = [
  { name: 'HomeSlider', tagPattern: /<section className="page_slider">[\s\S]*?<\/section>/ },
  { name: 'HomeClasses', tagPattern: /<section className="[^"]*program-carousel[^"]*"[\s\S]*?<\/section>/ },
  { name: 'HomeAbout', tagPattern: /<section className="[^"]*video-part[^"]*"[\s\S]*?<\/section>/ },
  { name: 'HomeTestimonials', tagPattern: /<section className="[^"]*testimonials-section[^"]*"[\s\S]*?<\/section>/ },
  { name: 'HomeTimetables', tagPattern: /<section className="[^"]*timetable[^"]*"[\s\S]*?<\/section>/ },
  { name: 'HomeFaq', tagPattern: /<section className="[^"]*faq[^"]*"[\s\S]*?<\/section>/ },
  { name: 'HomeChiefs', tagPattern: /<section className="[^"]*chiefs-carousel[^"]*"[\s\S]*?<\/section>/ },
  { name: 'HomeContacts', tagPattern: /<section className="[^"]*contact-form[^"]*"[\s\S]*?<\/section>/ },
  { name: 'HomeBlog', tagPattern: /<section className="[^"]*blog-carousel[^"]*"[\s\S]*?<\/section>/ }
];

let newHomeReturnContent = '<>\n';

components.forEach(comp => {
  let match = homeContent.match(comp.tagPattern);
  if (match) {
    let compJSX = match[0];
    let fileJSX = `import React from 'react';\nimport { MOCK_DATA } from '../../data/mockData';\n\nconst ${comp.name} = () => {\n  return (\n    ${compJSX}\n  );\n};\n\nexport default ${comp.name};\n`;
    fs.writeFileSync(\`/Users/hoangkien/NLV/baking/frontend/src/components/Home/\${comp.name}.jsx\`, fileJSX);
    newHomeReturnContent += `      <${comp.name} />\n`;
  } else {
    console.log("Could not find pattern for " + comp.name);
  }
});

newHomeReturnContent += '    </>';

// Rewrite Home.jsx
let imports = components.map(c => `import ${c.name} from '../components/Home/${c.name}';`).join('\n');

let newHomeFile = `import React from 'react';
${imports}

const Home = () => {
  return (
${newHomeReturnContent}
  );
};

export default Home;
`;

fs.writeFileSync('/Users/hoangkien/NLV/baking/frontend/src/pages/Home.jsx', newHomeFile);

