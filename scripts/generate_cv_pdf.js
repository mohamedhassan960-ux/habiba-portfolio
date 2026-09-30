import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateCV() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4: 595 x 842 pt
  const { width, height } = page.getSize();

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Palette tokens
  const blue = rgb(0.114, 0.306, 0.847); // #1D4ED8
  const dark = rgb(0.059, 0.09, 0.165); // #0F172A
  const gray = rgb(0.4, 0.45, 0.55);
  const lightBg = rgb(0.96, 0.97, 0.99);
  const lightBlue = rgb(0.9, 0.94, 1.0);
  const borderBlue = rgb(0.75, 0.85, 0.98);

  const margin = 45;
  let y = height - margin;

  // Header Background Card
  page.drawRectangle({
    x: margin - 10,
    y: y - 85,
    width: width - (margin - 10) * 2,
    height: 95,
    color: lightBg,
    borderColor: borderBlue,
    borderWidth: 1.5,
  });

  // Name & Title
  page.drawText('HABIBA YASSER', {
    x: margin + 15,
    y: y - 22,
    size: 24,
    font: fontBold,
    color: blue,
  });

  page.drawText('Graphic Designer & Video Editor | Faculty of Fine Arts Cairo', {
    x: margin + 15,
    y: y - 42,
    size: 11.5,
    font: fontBold,
    color: dark,
  });

  // Contact Info Row
  const contactText = 'Cairo, Egypt   |   +20 111 761 6300   |   habibamarghani1@gmail.com';
  page.drawText(contactText, {
    x: margin + 15,
    y: y - 62,
    size: 9.5,
    font: fontRegular,
    color: gray,
  });

  y -= 115;

  // Helper for Section Titles
  function drawSectionTitle(title) {
    page.drawText(title.toUpperCase(), {
      x: margin,
      y: y,
      size: 11,
      font: fontBold,
      color: blue,
    });
    page.drawLine({
      start: { x: margin, y: y - 5 },
      end: { x: width - margin, y: y - 5 },
      thickness: 1.2,
      color: borderBlue,
    });
    y -= 22;
  }

  // 1. PROFESSIONAL SUMMARY
  drawSectionTitle('Professional Summary');
  const summaryLines = [
    'Creative graphic designer and video editor with an academic foundation in Fine Arts (Cairo University, Class of 2028).',
    'Specializes in structured visual composition, social media campaign kits, editorial publications, and video post-production.',
    'Combines fine arts aesthetics with commercial clarity for emerging brands and content creators across Egypt and the Gulf.'
  ];
  summaryLines.forEach((line) => {
    page.drawText(line, {
      x: margin,
      y: y,
      size: 9.5,
      font: fontRegular,
      color: dark,
    });
    y -= 15;
  });

  y -= 10;

  // 2. EDUCATION
  drawSectionTitle('Education & Academic Background');
  page.drawText('Bachelor of Fine Arts — Graphic Design Department', {
    x: margin,
    y: y,
    size: 10.5,
    font: fontBold,
    color: dark,
  });
  page.drawText('2024 - 2028 (Expected)', {
    x: width - margin - 120,
    y: y,
    size: 9.5,
    font: fontBold,
    color: blue,
  });
  y -= 15;
  page.drawText('Faculty of Fine Arts, Cairo University — Class of 2028', {
    x: margin,
    y: y,
    size: 9.5,
    font: fontOblique,
    color: gray,
  });
  y -= 15;
  page.drawText('• Comprehensive foundation in classical anatomy, color theory, layout design, and digital visual communication.', {
    x: margin + 10,
    y: y,
    size: 9,
    font: fontRegular,
    color: dark,
  });

  y -= 24;

  // 3. CERTIFICATIONS & INDUSTRY CREDENTIALS
  drawSectionTitle('Verified Professional Certifications');
  const certs = [
    { title: 'Motion Graphics Certificate', org: 'TIEC (Technology Innovation & Entrepreneurship Center)', year: '2024' },
    { title: '2D Graphic Design Professional Track', org: 'ITI (Information Technology Institute, Ministry of Communications)', year: '2024' },
    { title: 'Digital Sound & Video Editing Specialization', org: 'ITI (Information Technology Institute)', year: '2024' },
    { title: 'Social Media Marketing & Content Design', org: 'TIEC (Technology Innovation & Entrepreneurship Center)', year: '2024' },
  ];

  certs.forEach((c) => {
    page.drawText(`•  ${c.title}`, {
      x: margin,
      y: y,
      size: 9.5,
      font: fontBold,
      color: dark,
    });
    page.drawText(c.year, {
      x: width - margin - 40,
      y: y,
      size: 9,
      font: fontBold,
      color: blue,
    });
    y -= 13;
    page.drawText(`    ${c.org}`, {
      x: margin + 10,
      y: y,
      size: 8.5,
      font: fontRegular,
      color: gray,
    });
    y -= 15;
  });

  y -= 8;

  // 4. CORE DISCIPLINES & EXPERTISE
  drawSectionTitle('Core Design Disciplines');
  const disciplines = [
    { title: 'Social Media Campaign Kits', desc: 'Feed designs, carousels, and stories tailored for engagement and visual identity.' },
    { title: 'Book Cover & Editorial Design', desc: 'Thoughtful typography, layout pacing, and cover compositions for print and digital editions.' },
    { title: 'YouTube Media & Thumbnails', desc: 'High-contrast focal points, legible mobile type, and narrative framing for creator channels.' },
    { title: 'Rhythmic Video Editing', desc: 'Paced cuts, reels/shorts optimization, sound synchronization, and motion graphics accents.' },
  ];

  disciplines.forEach((d) => {
    page.drawText(`•  ${d.title}: `, {
      x: margin,
      y: y,
      size: 9.5,
      font: fontBold,
      color: dark,
    });
    const titleWidth = fontBold.widthOfTextAtSize(`•  ${d.title}: `, 9.5);
    page.drawText(d.desc, {
      x: margin + titleWidth,
      y: y,
      size: 9,
      font: fontRegular,
      color: dark,
    });
    y -= 16;
  });

  y -= 8;

  // 5. SOFTWARE & TECHNICAL SKILLS
  drawSectionTitle('Technical Competencies & Creative Toolkit');
  page.drawText('Design & Vector:', { x: margin, y: y, size: 9.5, font: fontBold, color: dark });
  page.drawText('Adobe Photoshop, Adobe Illustrator, Adobe InDesign, Figma, Canva Pro', { x: margin + 100, y: y, size: 9, font: fontRegular, color: dark });
  y -= 16;

  page.drawText('Motion & Video:', { x: margin, y: y, size: 9.5, font: fontBold, color: dark });
  page.drawText('Adobe Premiere Pro, Adobe After Effects, CapCut, Adobe Audition', { x: margin + 100, y: y, size: 9, font: fontRegular, color: dark });
  y -= 16;

  page.drawText('AI & Innovation:', { x: margin, y: y, size: 9.5, font: fontBold, color: dark });
  page.drawText('Generative AI visual exploration (Midjourney, Gemini, ChatGPT), Concept Moodboards', { x: margin + 100, y: y, size: 9, font: fontRegular, color: dark });
  y -= 16;

  page.drawText('Languages:', { x: margin, y: y, size: 9.5, font: fontBold, color: dark });
  page.drawText('Arabic (Native), English (Professional Working Proficiency)', { x: margin + 100, y: y, size: 9, font: fontRegular, color: dark });

  y -= 24;

  // 6. FEATURED PROJECT
  drawSectionTitle('Featured Visual Study');
  page.drawText('Ashley Furniture Commercial & Editorial Visual Study (2024)', {
    x: margin,
    y: y,
    size: 10,
    font: fontBold,
    color: dark,
  });
  y -= 14;
  page.drawText('• Conceived and executed a 4-part visual campaign: Sculptural Root Chair, Promotional 50% Campaign,', {
    x: margin + 10,
    y: y,
    size: 9,
    font: fontRegular,
    color: dark,
  });
  y -= 13;
  page.drawText('  Dream Living Space (Jigsaw Metaphor), and Architectural Editorial Triptych Arches.', {
    x: margin + 10,
    y: y,
    size: 9,
    font: fontRegular,
    color: dark,
  });

  // Footer bar
  page.drawRectangle({
    x: margin,
    y: 28,
    width: width - margin * 2,
    height: 1,
    color: borderBlue,
  });
  page.drawText('Habiba Yasser — Portfolio & Case Studies: Online & Behance verified', {
    x: margin,
    y: 16,
    size: 8,
    font: fontRegular,
    color: gray,
  });

  const pdfBytes = await doc.save();
  const outputDir = path.resolve('public/assets');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'Habiba-Yasser-CV.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('PDF successfully generated at:', outputPath, 'Bytes:', pdfBytes.length);
}

generateCV().catch(console.error);
