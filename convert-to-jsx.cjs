// convert-to-jsx.cjs
// Run with: node convert-to-jsx.cjs

const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function convertFile(filePath) {
  if (!filePath.endsWith(".tsx")) return;

  let content = fs.readFileSync(filePath, "utf8");

  // Remove type annotations like : string, : number, etc.
  content = content.replace(/: \w+/g, "");

  // Remove interface/type blocks
  content = content.replace(/interface [^{]+{[^}]+}/g, "");
  content = content.replace(/type [^=]+ = [^;]+;/g, "");

  // Remove generics in hooks/components
  content = content.replace(/useState<[^>]+>\(/g, "useState(");
  content = content.replace(/useRef<[^>]+>\(/g, "useRef(");
  content = content.replace(/React\.forwardRef<[^>]+>/g, "React.forwardRef");

  // Remove React.FC
  content = content.replace(/React\.FC<[^>]+>/g, "");

  // Remove non-null assertions (!)
  content = content.replace(/!\)/g, ")");

  // Fix common TSX leftovers
  content = content.replace(/ as [^}\s]+/g, ""); // remove "as Type"
  content = content.replace(/\.([0-9]+)/g, ":$1"); // fix duration.5 → duration:0.5

  // Write back to .jsx file
  const newPath = filePath.replace(/\.tsx$/, ".jsx");
  fs.writeFileSync(newPath, content, "utf8");
  fs.unlinkSync(filePath);

  console.log(`Converted: ${filePath} → ${newPath}`);
}

// Run on src folder
walkDir(path.join(__dirname, "src"), convertFile);

console.log("✅ Project converted to JSX!");
