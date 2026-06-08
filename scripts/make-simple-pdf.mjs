import { readFileSync, writeFileSync } from "node:fs";

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  throw new Error("Usage: node scripts/make-simple-pdf.mjs <input.md> <output.pdf>");
}

const text = readFileSync(inputPath, "utf8")
  .replace(/\r\n/g, "\n")
  .replace(/```[a-z]*\n/g, "")
  .replace(/```/g, "");

const pageWidth = 612;
const pageHeight = 792;
const marginX = 54;
const marginTop = 56;
const lineHeight = 14;
const maxChars = 92;
const linesPerPage = Math.floor((pageHeight - marginTop - 54) / lineHeight);

function wrapLine(line) {
  if (line.trim() === "") {
    return [""];
  }

  const indent = line.match(/^\s*/)?.[0] ?? "";
  const words = line.trim().split(/\s+/);
  const lines = [];
  let current = indent;

  for (const word of words) {
    const candidate = current.trim() ? `${current} ${word}` : `${indent}${word}`;
    if (candidate.length > maxChars) {
      lines.push(current);
      current = `${indent}${word}`;
    } else {
      current = candidate;
    }
  }

  lines.push(current);
  return lines;
}

const wrappedLines = text.split("\n").flatMap(wrapLine);
const pages = [];

for (let index = 0; index < wrappedLines.length; index += linesPerPage) {
  pages.push(wrappedLines.slice(index, index + linesPerPage));
}

function escapePdfText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function makeStream(lines, pageNumber) {
  const chunks = ["BT", "/F1 10 Tf", "12 TL", `${marginX} ${pageHeight - marginTop} Td`];

  lines.forEach((line, index) => {
    if (index > 0) {
      chunks.push("T*");
    }

    const isHeading = line.startsWith("#");
    const cleaned = line.replace(/^#{1,4}\s*/, "");

    if (isHeading) {
      chunks.push("/F1 14 Tf");
      chunks.push(`(${escapePdfText(cleaned)}) Tj`);
      chunks.push("/F1 10 Tf");
      return;
    }

    chunks.push(`(${escapePdfText(cleaned)}) Tj`);
  });

  chunks.push("ET");
  chunks.push(`BT /F1 8 Tf ${pageWidth - 90} 28 Td (Page ${pageNumber}) Tj ET`);
  return chunks.join("\n");
}

const objects = [];

function addObject(body) {
  objects.push(body);
  return objects.length;
}

const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
const pagesId = addObject("");
const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
const pageIds = [];

pages.forEach((page, index) => {
  const stream = makeStream(page, index + 1);
  const contentId = addObject(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
  const pageId = addObject(
    `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`
  );
  pageIds.push(pageId);
});

objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

let pdf = "%PDF-1.4\n";
const offsets = [0];

objects.forEach((body, index) => {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += "0000000000 65535 f \n";
offsets.slice(1).forEach((offset) => {
  pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
});
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

writeFileSync(outputPath, pdf, "binary");
