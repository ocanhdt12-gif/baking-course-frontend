const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function fixPath(val) {
  if (!val) return val;
  // Giữ nguyên nếu đã bắt đầu bằng http, /uploads, hoặc /baking
  if (val.startsWith('http') || val.startsWith('/uploads') || val.startsWith('/baking')) {
    return val;
  }
  // Nếu bắt đầu bằng images/, biến thành /baking/images/
  if (val.startsWith('images/')) {
    return '/baking/' + val;
  }
  return val;
}

function fixHtml(htmlString) {
  if (!htmlString) return htmlString;
  // Đổi src="images/ hoặc src='images/ thành /baking/images/
  // Dùng regex thay thế
  return htmlString.replace(/src=["']images\//g, 'src="/baking/images/');
}

async function main() {
  console.log('--- STARTING IMAGE PATH MIGRATION ---');

  // 1. Posts
  const posts = await prisma.post.findMany();
  let postCount = 0;
  for (const post of posts) {
    let changed = false;
    let newThumb = post.thumbnail;
    let newContent = post.content;
    let newDesc = post.desc;

    if (newThumb !== fixPath(newThumb)) {
      newThumb = fixPath(newThumb);
      changed = true;
    }
    if (newContent !== fixHtml(newContent)) {
      newContent = fixHtml(newContent);
      changed = true;
    }
    if (newDesc !== fixHtml(newDesc)) {
      newDesc = fixHtml(newDesc);
      changed = true;
    }

    if (changed) {
      await prisma.post.update({
        where: { id: post.id },
        data: { thumbnail: newThumb, content: newContent, desc: newDesc }
      });
      postCount++;
    }
  }
  console.log(`Updated ${postCount} posts.`);

  // 2. Programs
  const programs = await prisma.program.findMany();
  let progCount = 0;
  for (const prog of programs) {
    let changed = false;
    let newThumb = prog.thumbnail;
    let newDesc = prog.description;

    if (newThumb !== fixPath(newThumb)) {
      newThumb = fixPath(newThumb);
      changed = true;
    }
    if (newDesc !== fixHtml(newDesc)) {
      newDesc = fixHtml(newDesc);
      changed = true;
    }

    if (changed) {
      await prisma.program.update({
        where: { id: prog.id },
        data: { thumbnail: newThumb, description: newDesc }
      });
      progCount++;
    }
  }
  console.log(`Updated ${progCount} programs.`);

  // 3. Chiefs
  const chiefs = await prisma.chief.findMany();
  let chiefCount = 0;
  for (const chief of chiefs) {
    let changed = false;
    let newThumb = chief.image;
    let newBio = chief.biography;

    if (newThumb !== fixPath(newThumb)) {
      newThumb = fixPath(newThumb);
      changed = true;
    }
    if (newBio !== fixHtml(newBio)) {
      newBio = fixHtml(newBio);
      changed = true;
    }

    if (changed) {
      await prisma.chief.update({
        where: { id: chief.id },
        data: { image: newThumb, biography: newBio }
      });
      chiefCount++;
    }
  }
  console.log(`Updated ${chiefCount} chiefs.`);

  console.log('--- MIGRATION COMPLETED SUCCESSFULLY ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
