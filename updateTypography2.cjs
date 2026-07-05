const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
};

const files = walkSync('src').filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace text-gradient-marine with solid marine blue
  content = content.replace(/text-gradient-marine/g, 'text-[#2DA8E8]');
  
  // Replace inline gradient with solid marine blue
  content = content.replace(/text-transparent bg-clip-text bg-gradient-to-r from-\[#00AEEF\] to-\[#60A5FA\]/g, 'text-[#2DA8E8]');
  content = content.replace(/bg-clip-text text-transparent bg-gradient-to-r from-\[#00AEEF\] to-\[#60A5FA\]/g, 'text-[#2DA8E8]');
  
  // Update Subheadings (text-muted) to be lighter gray
  // Tailwind text-gray-300 is #D1D5DB. The user wants #D1D5DB for subheadings and body.
  // We can just define text-muted as #D1D5DB in tailwind config instead of changing it here.
  
  // Buttons: update to SemiBold and strong padding
  // Let's find button tags and ensure they have font-semibold
  content = content.replace(/<button className="([^"]+)"/g, (match, classes) => {
    let newClasses = classes;
    newClasses = newClasses.replace(/font-bold/g, 'font-semibold');
    if (!newClasses.includes('font-semibold')) {
      newClasses += ' font-semibold';
    }
    // ensure tracking-wide or uppercase if needed, let's stick to title case/clean
    return `<button className="${newClasses}"`;
  });

  fs.writeFileSync(file, content);
});

console.log("Updated styles.");
