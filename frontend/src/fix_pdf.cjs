const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\DELL\\Documents\\nextgenLuxurystayformen\\frontend\\src\\pages';
const files = ['Payments.jsx', 'Expenses.jsx', 'Members.jsx', 'Complaints.jsx', 'Enquiries.jsx'];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/import { jsPDF } from "jspdf";/g, "import jsPDF from 'jspdf';");
    content = content.replace(/import "jspdf-autotable";/g, "import autoTable from 'jspdf-autotable';");
    content = content.replace(/doc\.autoTable\({/g, "autoTable(doc, {");
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', file);
  }
});
