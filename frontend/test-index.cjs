const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('/Users/hoangkien/NLV/baking/frontend/reference/HTML/index.html', 'utf8');
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

setTimeout(() => {
  const $ = dom.window.jQuery;
  if(!$) { console.log("jQuery not loaded"); return; }
  
  const carousel = $('.owl-carousel[data-filters=".gallery-filters"]');
  console.log("Original items length:", carousel.find('.owl-item:not(.cloned)').length);
  
  // Click 'All Categories'
  const allCat = $('.gallery-filters a[data-filter="*"]');
  allCat.trigger('click');
  
  setTimeout(() => {
    console.log("After clicking All Categories, items length:", carousel.find('.owl-item:not(.cloned)').length);
  }, 1000);
}, 3000);
