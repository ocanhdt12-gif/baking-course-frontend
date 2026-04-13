const fs = require('fs');

const pages = [
  { htmlFile: 'about.html', jsxFile: 'About.jsx', compName: 'About' },
  { htmlFile: 'program1.html', jsxFile: 'Program.jsx', compName: 'Program' },
  { htmlFile: 'blog-right.html', jsxFile: 'Receipt.jsx', compName: 'Receipt' },
  { htmlFile: 'contact.html', jsxFile: 'Contact.jsx', compName: 'Contact' }
];

const basePath = '/Users/hoangkien/NLV/baking/themeforest-5aMLDH4E-muka-bakery-and-cooking-classes-html-template/HTML/';
const outPath = '/Users/hoangkien/NLV/baking/frontend/src/pages/';

pages.forEach(p => {
  let html = fs.readFileSync(basePath + p.htmlFile, 'utf8');
  let startIdx = html.indexOf('<section class="page_title');
  let endIdx = html.indexOf('<footer class="page_footer');

  if (startIdx === -1 || endIdx === -1) {
    console.log("Could not parse limits for", p.htmlFile);
    return;
  }

  let bodyHTML = html.substring(startIdx, endIdx);

  bodyHTML = bodyHTML.replace(/class=/g, 'className=')
                     .replace(/for=/g, 'htmlFor=')
                     .replace(/tabindex=/gi, 'tabIndex=')
                     .replace(/<img([^>]*)>/g, (match, p1) => { return match.endsWith('/>') ? match : `<img${p1}/>`; })
                     .replace(/<hr([^>]*)>/g, (match, p1) => { return match.endsWith('/>') ? match : `<hr${p1}/>`; })
                     .replace(/<input([^>]*)>/g, (match, p1) => { return match.endsWith('/>') ? match : `<input${p1}/>`; })
                     .replace(/<br([^>]*)>/g, (match, p1) => { return match.endsWith('/>') ? match : `<br${p1}/>`; })
                     .replace(/style="([^"]*)"/g, (match, styleStr) => {
                         let props = styleStr.split(';').filter(s => s.trim()).map(s => {
                             let [k, v] = s.split(':');
                             k = k.trim().replace(/-([a-z])/g, (m, c1) => c1.toUpperCase());
                             return `${k}: "${v.trim()}"`;
                         }).join(', ');
                         return `style={{${props ? props : ''}}}`;
                     })
                     .replace(/<!--[\s\S]*?-->/g, ''); 

  let result = `import React from 'react';

const ${p.compName} = () => {
  return (
    <>
      ${bodyHTML}
    </>
  );
};

export default ${p.compName};
`;

  fs.writeFileSync(outPath + p.jsxFile, result);
  console.log("Wrote", outPath + p.jsxFile);
});
