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

  // Change font weights for headings
  content = content.replace(/font-heading font-bold/g, 'font-heading font-extrabold');
  content = content.replace(/font-heading font-semibold/g, 'font-heading font-extrabold');
  
  // Specific gradient replacements
  content = content.replace(/bg-gradient-to-r from-accent to-\[#F3E5AB\]/g, 'bg-gradient-to-r from-[#00AEEF] to-[#60A5FA]');
  content = content.replace(/bg-gradient-to-r from-white via-accent to-white/g, 'bg-gradient-to-r from-white via-[#00AEEF] to-white');
  
  // Replace text-accent with text-gradient-marine in specific typography classes (like h2, h3, h4, span, div)
  // This uses a regex to match className="... text-accent ..." where it's likely text.
  // Actually, let's just do a blanket replace for specific patterns
  content = content.replace(/text-accent/g, (match, offset, string) => {
    // If it's near an icon component (e.g. `<Icon ` or `<MapPin ` or `<div ... flex items-center justify-center text-accent`)
    // It's easier to just replace text-accent with text-gradient-marine IF it's part of a text element class like uppercase, font-bold, text-sm, etc.
    const context = string.substring(Math.max(0, offset - 30), Math.min(string.length, offset + 30));
    
    // If context looks like an icon, keep text-accent
    if (context.includes('size=') || context.includes('<') && context.match(/<[A-Z][a-zA-Z]+/) || context.includes('group-hover:text-accent') || context.includes('hover:text-accent')) {
      // keep it, or we can just be aggressive and change section titles specifically
      return 'text-accent'; 
    }
    
    // If it's a section title or statistic or similar text class
    if (context.includes('uppercase') || context.includes('font-') || context.includes('text-sm') || context.includes('text-xl') || context.includes('text-2xl')) {
      return 'text-gradient-marine';
    }
    
    return 'text-accent';
  });
  
  // Since the regex might be flaky, let's just do targeted replacements for section titles:
  content = content.replace(/className="text-accent text-sm font-bold tracking-widest uppercase/g, 'className="text-gradient-marine text-sm font-extrabold tracking-widest uppercase');
  content = content.replace(/className="text-accent font-heading/g, 'className="text-gradient-marine font-heading');
  content = content.replace(/className="text-accent text-sm/g, 'className="text-gradient-marine text-sm');
  
  // Force font-extrabold on text-4xl/5xl
  content = content.replace(/text-4xl md:text-5xl font-heading font-bold/g, 'text-4xl md:text-5xl font-heading font-extrabold');

  fs.writeFileSync(file, content);
});

console.log("Updated typography and colors.");
