const fs = require('fs');
const path = require('path');

const files = [
  'src/views/Products.vue',
  'src/views/Service.vue',
  'src/views/Contact.vue',
  'src/views/Relationship.vue',
  'src/views/Banquet.vue'
];

const replacements = [
  {
    from: /background: linear-gradient\(135deg, #a8edea 0%, #fed6e3 50%, #ffecd2 100%\);/g,
    to: 'background: linear-gradient(135deg, #002B5B 0%, #1A5F7A 50%, #57C5B6 100%);'
  },
  {
    from: /color: #2d3748;/g,
    to: 'color: white;'
  },
  {
    from: /background: rgba\(102, 126, 234, 0\.1\);/g,
    to: 'background: rgba(87, 197, 182, 0.2);'
  },
  {
    from: /color: rgba\(45, 55, 72, 0\.7\);/g,
    to: 'color: rgba(255, 255, 255, 0.8);'
  },
  {
    from: /text-shadow: 0 2px 8px rgba\(0, 0, 0, 0\.08\);/g,
    to: 'text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);'
  },
  {
    from: /background: linear-gradient\(90deg, #667eea, #764ba2\);/g,
    to: 'background: rgba(255, 255, 255, 0.6);'
  },
  {
    from: /color: rgba\(45, 55, 72, 0\.8\);/g,
    to: 'color: rgba(255, 255, 255, 0.9);'
  }
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(replace => {
      content = content.replace(replace.from, replace.to);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('All files updated successfully!');
