const fs = require('fs');
let html = fs.readFileSync('/Users/hoangkien/NLV/baking/themeforest-5aMLDH4E-muka-bakery-and-cooking-classes-html-template/HTML/index.html', 'utf8');

let start = html.indexOf('<section class="page_slider">');
let end = html.indexOf('<section class="page_copyright');
let bodyHTML = html.substring(start, end);

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
                           k = k.trim().replace(/-([a-z])/g, (m, p1) => p1.toUpperCase());
                           return `${k}: "${v.trim()}"`;
                       }).join(', ');
                       return `style={{${props}}}`;
                   })
                   .replace(/<!--[\s\S]*?-->/g, ''); 

fs.writeFileSync('/Users/hoangkien/NLV/baking/frontend/src/pages/Home.jsx', `
import React from 'react';

const Home = () => {
  return (
    <>
      ${bodyHTML}
    </>
  );
};

export default Home;
`);
