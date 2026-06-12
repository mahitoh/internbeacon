/**
 * Demo data seeder — realistic Cameroonian companies, offers, students,
 * CVs (real generated PDFs) and applications across every pipeline stage.
 *
 * Run:        node scripts/seed-demo-data.js
 * Idempotent: re-running updates profiles, skips existing offers/applications.
 * Password for ALL seeded accounts: InternBeacon!Dev1
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { supabaseAdmin } = require('../src/config/supabase');

const PASSWORD = 'InternBeacon!Dev1';

// ── Minimal PDF generator (text-based, parseable by pdf-parse & Chrome) ──────
function buildSimplePdf(lines) {
  const esc = s => String(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  let content = 'BT /F1 11 Tf 50 770 Td 16 TL\n';
  for (const line of lines) content += `(${esc(line)}) Tj T*\n`;
  content += 'ET';

  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((body, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefPos = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return Buffer.from(pdf, 'latin1');
}

const daysFromNow = d => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
const daysAgo     = d => new Date(Date.now() - d * 86400000).toISOString();

// ── Companies ────────────────────────────────────────────────────────────────
const COMPANIES = [
  {
    email: 'paylink@internbeacon.dev', company_name: 'PayLink Cameroon', sector: 'Fintech',
    city: 'Douala', address: 'Immeuble Hollando, 4th floor, Boulevard de la Liberté, Akwa',
    phone: '+237 671 234 501', website_url: 'https://paylink.cm', employee_size: '51-200', is_verified: true,
    description: 'PayLink Cameroon builds mobile-money infrastructure powering merchant payments across Central Africa. Our APIs process over 2M transactions monthly for banks, telcos and SMEs. Interns join real product squads with a dedicated mentor and weekly demos.',
  },
  {
    email: 'siliconmountain@internbeacon.dev', company_name: 'Silicon Mountain Labs', sector: 'Software Development',
    city: 'Buea', address: 'Ndamukong Street, opposite Checkpoint Junction, Molyko',
    phone: '+237 672 234 502', website_url: 'https://smlabs.cm', employee_size: '11-50', is_verified: true,
    description: 'A product studio in the heart of Silicon Mountain. We ship web and mobile apps for clients in three continents and run the largest developer meetup in the Southwest region. Interns pair-program daily with senior engineers.',
  },
  {
    email: 'agrovision@internbeacon.dev', company_name: 'AgroVision SARL', sector: 'Agritech',
    city: 'Yaoundé', address: 'Rue 1839 Bastos, behind Total Bastos station',
    phone: '+237 673 234 503', website_url: 'https://agrovision.cm', employee_size: '11-50', is_verified: true,
    description: 'AgroVision uses satellite imagery and IoT soil sensors to help cocoa and maize cooperatives raise yields. Backed by the World Bank ag-innovation fund. Field visits to partner farms in the Centre region are part of every internship.',
  },
  {
    email: 'saheltelecom@internbeacon.dev', company_name: 'Sahel Telecom', sector: 'Telecommunications',
    city: 'Yaoundé', address: 'Immeuble SOTUC, Avenue Kennedy, Centre-ville',
    phone: '+237 674 234 504', website_url: 'https://saheltelecom.cm', employee_size: '201-500', is_verified: false,
    description: 'Regional ISP operating fibre backbones between Yaoundé, Douala and N\'Djamena. Our NOC monitors 4,000 km of fibre 24/7. Interns rotate through network operations, field engineering and customer systems.',
  },
  {
    email: 'bluehealth@internbeacon.dev', company_name: 'BlueHealth Africa', sector: 'HealthTech',
    city: 'Douala', address: 'Rue Njo-Njo, Bonapriso, Immeuble Le Concorde, 2nd floor',
    phone: '+237 675 234 505', website_url: 'https://bluehealth.africa', employee_size: '11-50', is_verified: true,
    description: 'BlueHealth runs a telemedicine platform connecting 40,000 patients with doctors across Littoral region, plus electronic medical records for 12 clinics. Interns work on products that directly affect patient care.',
  },
  {
    email: 'montfebe@internbeacon.dev', company_name: 'Mont Fébé Finance', sector: 'Banking & Microfinance',
    city: 'Yaoundé', address: 'Immeuble T Bella, Boulevard du 20 Mai, face Hilton',
    phone: '+237 676 234 506', website_url: 'https://montfebefinance.cm', employee_size: '51-200', is_verified: true,
    description: 'Category-2 microfinance institution with 14 branches and 60,000 clients. We are digitising lending end-to-end — credit scoring, agent banking, and USSD services. Finance and IT interns work side by side.',
  },
  {
    email: 'kribilogistics@internbeacon.dev', company_name: 'Kribi Logistics Group', sector: 'Logistics & Supply Chain',
    city: 'Douala', address: 'Zone Portuaire, Rue Joffre, Bonanjo (HQ) — operations at Kribi Deep Sea Port',
    phone: '+237 677 234 507', website_url: 'https://kribilogistics.cm', employee_size: '201-500', is_verified: false,
    description: 'Freight forwarding and customs clearance operator at Douala and Kribi ports. We move 800+ containers monthly for importers across CEMAC. Interns learn port operations, customs documentation and our tracking systems.',
  },
  {
    email: 'limbecreative@internbeacon.dev', company_name: 'Limbe Creative Hub', sector: 'Marketing & Media',
    city: 'Limbe', address: 'Down Beach Road, next to Atlantic Beach Hotel',
    phone: '+237 678 234 508', website_url: 'https://limbecreative.cm', employee_size: '1-10', is_verified: false,
    description: 'Boutique digital agency serving tourism and FMCG brands in the Southwest. Social campaigns, brand films, influencer activations. Small team — interns get real client accounts from week two.',
  },
];

// ── Offers (companyEmail links offer → company) ──────────────────────────────
const OFFERS = [
  // PayLink — Fintech / IT
  {
    companyEmail: 'paylink@internbeacon.dev',
    title: 'Backend Developer Intern (Payments API)', domain: 'Information Technology',
    description: 'Join the core payments squad building the APIs that move money for 2M+ monthly transactions. You will design endpoints, write integration tests against mobile-money sandboxes (MTN MoMo, Orange Money), and ship to production behind feature flags.\n\nOffice: Immeuble Hollando, 4th floor, Akwa — 5 min walk from Bonanjo shared-taxi line. Hybrid possible after month one (3 days on-site).\n\nInterview process: 30-min HR call → 1h technical interview (live coding, JavaScript) → final chat with the CTO.\nDocuments to bring on day one: national ID card (CNI), certificate of enrollment (attestation de scolarité), 2 passport photos, RIB or MoMo number for stipend.',
    responsibilities: '- Build and document REST endpoints with Node.js/Express\n- Write integration tests for mobile-money sandbox flows\n- Participate in daily stand-ups and bi-weekly demos\n- Investigate production issues with your mentor',
    requirements: 'For 3rd year students and above in Computer Science or Software Engineering. Solid JavaScript fundamentals required; English working proficiency (team is bilingual).',
    required_skills: ['JavaScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git'],
    location: 'Douala (Akwa) — hybrid', duration_weeks: 12, is_paid: true, stipend_amount: 75000, openings: 2, deadlineDays: 21,
  },
  {
    companyEmail: 'paylink@internbeacon.dev',
    title: 'Data Analyst Intern (Transaction Insights)', domain: 'Information Technology',
    description: 'Work with the data team to analyse transaction patterns, build fraud-signal dashboards and automate weekly reporting for the leadership team.\n\nInterview: one 45-min interview with the Head of Data (SQL exercise included).\nBring on day one: CNI, enrollment certificate, laptop (we provide a second screen).',
    responsibilities: '- Write SQL for ad-hoc analyses and dashboards\n- Maintain Metabase dashboards used by ops daily\n- Document data definitions in the team wiki',
    requirements: 'Year 3+ students in Computer Science, Statistics or related. SQL is the core requirement.',
    required_skills: ['SQL', 'Excel', 'Python', 'Data Visualization'],
    location: 'Douala (Akwa) — on-site', duration_weeks: 10, is_paid: true, stipend_amount: 60000, openings: 1, deadlineDays: 14,
  },
  // Silicon Mountain Labs
  {
    companyEmail: 'siliconmountain@internbeacon.dev',
    title: 'Frontend Developer Intern (React)', domain: 'Information Technology',
    description: 'Ship real client features in React with a senior engineer reviewing every PR. Current projects: an e-learning platform for a Nigerian client and a logistics dashboard.\n\nOur office is in Molyko, Buea — opposite Checkpoint Junction, 10 min from UB campus. Casual dress, free coffee, fibre internet even when ENEO disagrees (full solar + inverter backup).\n\nInterview: take-home exercise (build a small component, ~2h) then a 45-min review call.\nDay-one documents: CNI or passport, certificate of enrollment.',
    responsibilities: '- Build UI components from Figma designs\n- Write unit tests with Vitest\n- Join client demo calls (listen-in first month, present after)',
    requirements: 'Open to Year 2 and above. Bachelor students in any computing programme. Portfolio or GitHub link strongly preferred.',
    required_skills: ['React', 'JavaScript', 'Tailwind', 'Git', 'HTML', 'CSS'],
    location: 'Buea (Molyko) — on-site', duration_weeks: 12, is_paid: true, stipend_amount: 50000, openings: 3, deadlineDays: 30,
  },
  {
    companyEmail: 'siliconmountain@internbeacon.dev',
    title: 'Mobile Developer Intern (Flutter)', domain: 'Information Technology',
    description: 'Help build a savings-group (njangi) mobile app used by 8,000 members. You will own small features end-to-end: UI, state management, API integration.\n\nInterview: 1h technical chat — bring any app you have built, even a school project.\nDocuments: CNI, enrollment certificate.',
    responsibilities: '- Implement screens and flows in Flutter\n- Integrate REST APIs\n- Test on low-end Android devices (we have a device lab)',
    requirements: 'Year 3+ preferred. Any mobile experience (Flutter, React Native, or native) acceptable — we teach Flutter.',
    required_skills: ['Flutter', 'Dart', 'REST APIs', 'Git'],
    location: 'Buea (Molyko) — on-site', duration_weeks: 16, is_paid: true, stipend_amount: 50000, openings: 1, deadlineDays: 10,
  },
  {
    companyEmail: 'siliconmountain@internbeacon.dev',
    title: 'UI/UX Design Intern', domain: 'Information Technology',
    description: 'Design interfaces for client projects under our design lead. From user flows to polished Figma components and developer handoff.\n\nInterview: portfolio review (30 min) + small live design exercise.\nDocuments to bring: CNI, enrollment certificate, your portfolio on a laptop or tablet.',
    responsibilities: '- Produce wireframes and high-fidelity mockups in Figma\n- Maintain the design system library\n- Run quick usability tests with real users',
    requirements: 'Year 2+. Programme flexible — what matters is the portfolio.',
    required_skills: ['Figma', 'UI-UX Design', 'Prototyping'],
    location: 'Buea (Molyko) — hybrid', duration_weeks: 12, is_paid: false, openings: 1, deadlineDays: 25,
  },
  // AgroVision
  {
    companyEmail: 'agrovision@internbeacon.dev',
    title: 'Agronomy Field Intern (Cocoa Programme)', domain: 'Agriculture',
    description: 'Support our cocoa yield programme with partner cooperatives in the Centre region. Mix of field work (soil sampling, sensor installation, farmer training) and office analysis in Bastos.\n\nField days include transport from our Yaoundé office and lunch allowance. Boots and field kit provided.\n\nInterview: 45-min discussion with the Programme Manager.\nDocuments for day one: CNI, enrollment certificate, medical fitness certificate (any district hospital), yellow-fever vaccination card for field travel.',
    responsibilities: '- Collect and log soil/plant samples with our mobile app\n- Assist farmer training sessions (French required, Ewondo a plus)\n- Enter and clean field data, basic analysis in Excel',
    requirements: 'Year 3+ in Agronomy, Agriculture, Environmental Science or Biology. Must be comfortable with 2-3 field days per week. French fluency required.',
    required_skills: ['Agronomy', 'Excel', 'Data Collection', 'French'],
    location: 'Yaoundé (Bastos) + field, Centre region', duration_weeks: 16, is_paid: true, stipend_amount: 55000, openings: 2, deadlineDays: 18,
  },
  {
    companyEmail: 'agrovision@internbeacon.dev',
    title: 'GIS & Remote Sensing Intern', domain: 'Information Technology',
    description: 'Process satellite imagery (Sentinel-2) to map farm boundaries and vegetation indices for our cooperative dashboard.\n\nInterview: one technical call — we will share a sample dataset beforehand.\nDocuments: CNI, enrollment certificate.',
    responsibilities: '- Process imagery in QGIS / Python (rasterio)\n- Maintain the farm-boundary database (PostGIS)\n- Produce monthly NDVI report maps',
    requirements: 'Year 4+ in Geomatics, Computer Science, Geography or related. QGIS experience required, Python strongly preferred.',
    required_skills: ['QGIS', 'Python', 'PostGIS', 'Remote Sensing'],
    location: 'Yaoundé (Bastos) — on-site', duration_weeks: 12, is_paid: true, stipend_amount: 65000, openings: 1, deadlineDays: 35,
  },
  // Sahel Telecom
  {
    companyEmail: 'saheltelecom@internbeacon.dev',
    title: 'Network Operations Intern (NOC)', domain: 'Telecommunications',
    description: 'Rotate through our 24/7 Network Operations Centre monitoring 4,000 km of fibre. Learn alarm triage, ticket escalation, and capacity reporting on live infrastructure.\n\nNOC is at Immeuble SOTUC, Avenue Kennedy — secure building, badge issued on day one (bring documents below for badge processing).\n\nInterview: HR screening + technical interview with the NOC supervisor (basic networking questions: OSI, IP addressing, fibre basics).\nDocuments for badge & contract: CNI (original + copy), enrollment certificate, 4 passport photos, criminal-record extract (extrait de casier judiciaire, bulletin n°3).',
    responsibilities: '- Monitor network alarms and open tickets per runbook\n- Shadow field teams on fibre-cut interventions (day shifts only)\n- Update network documentation and diagrams',
    requirements: 'Year 3+ in Telecommunications, Networks or Electrical Engineering. CCNA coursework a strong plus. Shift work (day shifts only for interns).',
    required_skills: ['Networking', 'TCP/IP', 'Cisco', 'Fibre Optics'],
    location: 'Yaoundé (Centre-ville) — on-site', duration_weeks: 24, is_paid: true, stipend_amount: 70000, openings: 4, deadlineDays: 28,
  },
  {
    companyEmail: 'saheltelecom@internbeacon.dev',
    title: 'IT Support & Systems Intern', domain: 'Information Technology',
    description: 'Support 300 staff across HQ and 3 regional offices: workstation setup, Active Directory, Office 365 administration, and our internal helpdesk queue.\n\nInterview: single 45-min interview (practical scenarios).\nDocuments: CNI, enrollment certificate, 2 passport photos.',
    responsibilities: '- Resolve helpdesk tickets (hardware, accounts, printers)\n- Image and deploy laptops\n- Maintain asset inventory',
    requirements: 'Year 2+ in any IT programme. Customer-friendly attitude matters as much as technical skill.',
    required_skills: ['Windows', 'Active Directory', 'IT Support', 'Office 365'],
    location: 'Yaoundé (Centre-ville) — on-site', duration_weeks: 12, is_paid: true, stipend_amount: 45000, openings: 2, deadlineDays: 7,
  },
  // BlueHealth
  {
    companyEmail: 'bluehealth@internbeacon.dev',
    title: 'Full-Stack Developer Intern (Telemedicine)', domain: 'Information Technology',
    description: 'Build features on our patient-doctor platform: appointment booking, e-prescriptions, and the clinic EMR module. React + Node.js + PostgreSQL stack, deployed on AWS.\n\nOffice: Immeuble Le Concorde, 2nd floor, Bonapriso. Health data means we take security seriously — you will sign an NDA and complete our data-protection onboarding (half day).\n\nInterview: 30-min screen → 1h pairing session on a small feature → offer.\nDay-one documents: CNI, enrollment certificate, signed NDA (sent by email beforehand).',
    responsibilities: '- Ship features across React frontend and Node API\n- Write tests; participate in code review\n- Join weekly clinical-staff feedback sessions',
    requirements: 'Year 3+ in Software Engineering or Computer Science. JavaScript across the stack required.',
    required_skills: ['React', 'Node.js', 'PostgreSQL', 'JavaScript', 'AWS'],
    location: 'Douala (Bonapriso) — hybrid', duration_weeks: 12, is_paid: true, stipend_amount: 80000, openings: 1, deadlineDays: 20,
  },
  {
    companyEmail: 'bluehealth@internbeacon.dev',
    title: 'Public Health Data Intern', domain: 'Healthcare',
    description: 'Analyse anonymised consultation data to surface disease-trend insights for our partner clinics and quarterly Ministry of Health reports.\n\nInterview: 45 min with the Medical Director and Data Lead.\nDocuments: CNI, enrollment certificate, signed NDA.',
    responsibilities: '- Clean and analyse consultation datasets (Excel/Python)\n- Draft charts and summaries for quarterly health reports\n- Support clinic onboarding data audits',
    requirements: 'Year 3+ in Public Health, Medicine, Statistics or related. Strong Excel; Python a plus. Bilingual FR/EN preferred.',
    required_skills: ['Excel', 'Statistics', 'Python', 'Epidemiology'],
    location: 'Douala (Bonapriso) — on-site', duration_weeks: 10, is_paid: true, stipend_amount: 55000, openings: 1, deadlineDays: 12,
  },
  // Mont Fébé Finance
  {
    companyEmail: 'montfebe@internbeacon.dev',
    title: 'Credit Analysis Intern', domain: 'Finance & Banking',
    description: 'Learn end-to-end micro-lending: file review, field verification visits with loan officers, scoring-model inputs, and committee presentations.\n\nOffice: Immeuble T Bella, Boulevard du 20 Mai (face Hilton). Business dress code Monday-Thursday, smart casual Friday.\n\nInterview: HR interview + case study (analyse a sample loan file, 45 min).\nDocuments for day one: CNI, enrollment certificate, 2 passport photos, bank/MoMo details for stipend.',
    responsibilities: '- Pre-analyse loan applications against policy checklist\n- Join field verification visits (2 per week, transport covered)\n- Prepare files for credit committee',
    requirements: 'Year 3+ in Banking & Finance, Accounting, Economics or Management. Comfortable with Excel. French and English both used daily.',
    required_skills: ['Excel', 'Financial Analysis', 'Accounting', 'French'],
    location: 'Yaoundé (Centre-ville) — on-site', duration_weeks: 12, is_paid: true, stipend_amount: 50000, openings: 2, deadlineDays: 15,
  },
  {
    companyEmail: 'montfebe@internbeacon.dev',
    title: 'Digital Banking Product Intern', domain: 'Finance & Banking',
    description: 'Work with the digital team launching our USSD banking service: user testing in branches, requirements documentation, and competitor analysis across CEMAC.\n\nInterview: one 45-min conversation with the Digital Product Manager.\nDocuments: CNI, enrollment certificate, 2 passport photos.',
    responsibilities: '- Run user-testing sessions at branches (script provided)\n- Document requirements and edge cases for the dev vendor\n- Track competitor USSD/app features monthly',
    requirements: 'Year 3+, programme flexible (Business, IT, or Finance). Curiosity about fintech required; bilingual a strong plus.',
    required_skills: ['Product Research', 'Excel', 'Documentation', 'UX Research'],
    location: 'Yaoundé (Centre-ville) — on-site', duration_weeks: 10, is_paid: true, stipend_amount: 45000, openings: 1, deadlineDays: 40,
  },
  // Kribi Logistics
  {
    companyEmail: 'kribilogistics@internbeacon.dev',
    title: 'Supply Chain Operations Intern', domain: 'Engineering',
    description: 'Track container movements between Douala and Kribi ports, update our TMS, and analyse dwell-time bottlenecks. Two supervised port visits per month (PPE provided: helmet, vest, boots — bring your shoe size!).\n\nHQ: Rue Joffre, Bonanjo, Douala.\n\nInterview: HR call + operations interview with the Port Ops Manager.\nDocuments for port access badge: CNI (original + 2 copies), enrollment certificate, 4 passport photos, medical fitness certificate.',
    responsibilities: '- Update shipment milestones in the TMS daily\n- Reconcile customs documentation packs\n- Build the weekly dwell-time report (Excel)',
    requirements: 'Year 3+ in Logistics, Industrial Engineering, Transport or Management. Rigour with paperwork is essential — customs errors cost money.',
    required_skills: ['Excel', 'Logistics', 'Supply Chain', 'Documentation'],
    location: 'Douala (Bonanjo) + Kribi port visits', duration_weeks: 16, is_paid: true, stipend_amount: 60000, openings: 2, deadlineDays: 22,
  },
  {
    companyEmail: 'kribilogistics@internbeacon.dev',
    title: 'Fleet Maintenance Engineering Intern', domain: 'Engineering',
    description: 'Support the workshop team maintaining our 35-truck fleet: preventive maintenance scheduling, parts inventory, and downtime analysis.\n\nInterview: technical chat with the Fleet Manager at the Bonanjo workshop.\nDocuments: CNI, enrollment certificate, medical fitness certificate. Safety boots provided.',
    responsibilities: '- Maintain the preventive-maintenance calendar\n- Track parts stock and reorder points\n- Analyse breakdown causes monthly',
    requirements: 'Year 3+ in Mechanical Engineering or Electromechanics. Hands-on attitude; workshop days are workshop days.',
    required_skills: ['Mechanical Engineering', 'Excel', 'Maintenance Planning'],
    location: 'Douala (Bonanjo workshop)', duration_weeks: 12, is_paid: true, stipend_amount: 50000, openings: 1, deadlineDays: 2,
  },
  // Limbe Creative Hub
  {
    companyEmail: 'limbecreative@internbeacon.dev',
    title: 'Social Media & Content Intern', domain: 'Marketing & Sales',
    description: 'Run content calendars for two tourism clients: shoot days at Down Beach, caption writing, scheduling, and monthly performance reports. You will be on camera occasionally — energy required!\n\nStudio: Down Beach Road, Limbe, next to Atlantic Beach Hotel.\n\nInterview: 30-min vibe-and-portfolio chat (bring 3 posts you would improve and how).\nDocuments: CNI, enrollment certificate.',
    responsibilities: '- Draft and schedule posts (Instagram, TikTok, Facebook)\n- Assist shoots: lighting, props, behind-the-scenes capture\n- Compile monthly engagement reports',
    requirements: 'Year 2+, any programme. Show us an account you have grown — personal counts.',
    required_skills: ['Social Media', 'Content Creation', 'Canva', 'Copywriting'],
    location: 'Limbe (Down Beach) — on-site', duration_weeks: 8, is_paid: false, openings: 2, deadlineDays: 17,
  },
  {
    companyEmail: 'limbecreative@internbeacon.dev',
    title: 'Videography & Editing Intern', domain: 'Marketing & Sales',
    description: 'Shoot and edit brand films and reels for FMCG and tourism clients. Gear provided (Sony FX30, DJI gimbal, drone — licensed pilot on staff).\n\nInterview: portfolio review — send a reel link with your application.\nDocuments: CNI, enrollment certificate.',
    responsibilities: '- Second-camera on client shoots\n- Edit reels and 60-90s brand cuts (Premiere/CapCut)\n- Organise and back up footage library',
    requirements: 'Year 2+. Portfolio decides — programme is irrelevant if the cut is clean.',
    required_skills: ['Video Editing', 'Premiere Pro', 'Videography', 'Storytelling'],
    location: 'Limbe (Down Beach) + client locations', duration_weeks: 12, is_paid: true, stipend_amount: 40000, openings: 1, deadlineDays: 26,
  },
  // One closing-today offer for the deadline chip demo
  {
    companyEmail: 'paylink@internbeacon.dev',
    title: 'QA & Testing Intern (closes soon!)', domain: 'Information Technology',
    description: 'Join the QA guild: write test cases for new payment features, run regression packs before each release, and learn API testing with Postman.\n\nInterview: single 45-min interview.\nDocuments: CNI, enrollment certificate, 2 passport photos.',
    responsibilities: '- Execute and document regression test packs\n- Write Postman collections for new endpoints\n- Log and triage bugs with severity tags',
    requirements: 'Year 2+ in any computing programme. Attention to detail is the whole job.',
    required_skills: ['Software Testing', 'Postman', 'Test Cases', 'JIRA'],
    location: 'Douala (Akwa) — on-site', duration_weeks: 10, is_paid: true, stipend_amount: 50000, openings: 1, deadlineDays: 0,
  },
];

// ── Students ─────────────────────────────────────────────────────────────────
const STUDENTS = [
  {
    email: 'brice.fotso@internbeacon.dev', first_name: 'Brice', last_name: 'Fotso',
    university: 'ICT University', faculty: 'FICT', programme: 'BSc Software Engineering', study_year: 4,
    phone: '+237 690 111 001', languages: ['English', 'French'],
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Git', 'Tailwind', 'REST APIs'],
    bio: 'Final-year software engineering student passionate about fintech. Built a campus marketplace app used by 300+ students. Looking for a backend or full-stack internship in Douala.',
    github_url: 'https://github.com/bricefotso-demo', linkedin_url: 'https://linkedin.com/in/bricefotso-demo',
    cv: [
      'BRICE FOTSO', 'Douala, Cameroon | +237 690 111 001 | brice.fotso@internbeacon.dev', '',
      'EDUCATION',
      'BSc Software Engineering - ICT University, Yaounde (Year 4, expected 2027)',
      'GCE A-Levels - Lycee de Bonaberi, Douala (2023)', '',
      'EXPERIENCE',
      'Freelance Web Developer (2025-present): built campus marketplace app',
      'with React, Node.js and PostgreSQL, serving 300+ student users.',
      'IT Club Vice-President, ICT University (2025): organised 4 hackathons.', '',
      'SKILLS',
      'JavaScript, React, Node.js, Express, PostgreSQL, Git, Tailwind CSS, REST APIs', '',
      'LANGUAGES', 'English (fluent), French (fluent)',
    ],
  },
  {
    email: 'aisha.bello@internbeacon.dev', first_name: 'Aisha', last_name: 'Bello',
    university: 'University of Yaoundé I', faculty: 'Faculty of Science', programme: 'BSc Computer Science', study_year: 3,
    phone: '+237 690 111 002', languages: ['English', 'French', 'Fulfulde'],
    skills: ['Python', 'SQL', 'Excel', 'Data Visualization', 'Statistics'],
    bio: 'Third-year CS student focused on data analysis. Kaggle bronze medalist. Seeking a data internship where numbers meet real decisions.',
    github_url: 'https://github.com/aishabello-demo',
    cv: [
      'AISHA BELLO', 'Yaounde, Cameroon | +237 690 111 002 | aisha.bello@internbeacon.dev', '',
      'EDUCATION',
      'BSc Computer Science - University of Yaounde I (Year 3)',
      'Baccalaureat C - Lycee de Garoua (2023)', '',
      'PROJECTS & EXPERIENCE',
      'Kaggle competitions: bronze medal, retail-forecasting challenge (2025)',
      'Market-price tracker: scraped and visualised Mfoundi market prices',
      'with Python and Plotly; cited by a local radio programme.', '',
      'SKILLS',
      'Python (pandas, matplotlib), SQL, Excel, statistics, data visualization', '',
      'LANGUAGES', 'English (fluent), French (fluent), Fulfulde (native)',
    ],
  },
  {
    email: 'kevin.ngu@internbeacon.dev', first_name: 'Kevin', last_name: 'Ngu',
    university: 'University of Buea', faculty: 'College of Technology', programme: 'BEng Telecommunications', study_year: 4,
    phone: '+237 690 111 003', languages: ['English', 'French'],
    skills: ['Networking', 'TCP/IP', 'Cisco', 'Linux', 'Python'],
    bio: 'Telecoms engineering student, CCNA in progress. Home lab with three salvaged routers. I want to live inside a NOC.',
    cv: [
      'KEVIN NGU', 'Buea, Cameroon | +237 690 111 003 | kevin.ngu@internbeacon.dev', '',
      'EDUCATION',
      'BEng Telecommunications - University of Buea (Year 4)',
      'CCNA coursework in progress (Cisco NetAcad, 2026)', '',
      'EXPERIENCE',
      'Network volunteer, UB campus IT (2025): assisted WiFi AP deployment',
      'across 2 faculties; documented switch configurations.',
      'Home lab: OSPF/VLAN practice on salvaged Cisco 2960 switches.', '',
      'SKILLS',
      'Networking, TCP/IP, Cisco IOS, VLANs, OSPF basics, Linux, Python scripting', '',
      'LANGUAGES', 'English (fluent), French (working)',
    ],
  },
  {
    email: 'marie.essomba@internbeacon.dev', first_name: 'Marie', last_name: 'Essomba',
    university: 'ESSEC Douala', faculty: 'Business School', programme: 'BSc Banking & Finance', study_year: 3,
    phone: '+237 690 111 004', languages: ['French', 'English'],
    skills: ['Excel', 'Accounting', 'Financial Analysis', 'PowerPoint'],
    bio: 'Banking & finance student at ESSEC. Treasurer of the junior enterprise. Aiming for credit analysis or digital banking internships in Yaoundé or Douala.',
    cv: [
      'MARIE ESSOMBA', 'Douala, Cameroon | +237 690 111 004 | marie.essomba@internbeacon.dev', '',
      'EDUCATION',
      'BSc Banking & Finance - ESSEC Douala (Year 3)',
      'Baccalaureat G2 - College de la Retraite, Yaounde (2023)', '',
      'EXPERIENCE',
      'Treasurer, ESSEC Junior Enterprise (2025-present): manage a 1.2M FCFA',
      'annual budget; produced monthly statements adopted by the board.',
      'Sales assistant (holidays), Santa Lucia supermarket: cash reconciliation.', '',
      'SKILLS',
      'Excel (advanced: pivot tables, VLOOKUP), accounting fundamentals,',
      'financial statement analysis, PowerPoint', '',
      'LANGUAGES', 'French (native), English (working proficiency)',
    ],
  },
];

// ── Applications (studentEmail x offerTitle, varied pipeline stages) ─────────
const APPLICATIONS = [
  {
    studentEmail: 'brice.fotso@internbeacon.dev', offerTitle: 'Backend Developer Intern (Payments API)',
    status: 'interview_scheduled', appliedDaysAgo: 9, reviewedDaysAgo: 6,
    interview: {
      date: daysFromNow(3) + 'T10:00:00+01:00', type: 'in_person',
      location: 'PayLink Cameroon, Immeuble Hollando 4th floor, Boulevard de la Liberté, Akwa, Douala — ask for Linda at reception',
      notes: 'Bring: CNI, certificate of enrollment, 2 passport photos. Dress: smart casual. The interview is 1h: 30 min live coding (JavaScript) + 30 min discussion. Ask for the wifi code for the coding exercise.',
    },
    cover_letter: 'Dear PayLink team,\n\nI built a campus marketplace processing mobile-money payments for 300+ students, which taught me exactly the sandbox quirks your job post mentions. I am in my final year of Software Engineering at ICT University and can commit 12 weeks full-time.\n\nMy stack matches yours: Node.js, Express, PostgreSQL, tested with Jest. I would love to learn how payments work at real scale.\n\nBest regards,\nBrice Fotso',
    company_note: 'Strong portfolio — marketplace app is real, checked the repo. Moving straight to technical interview.',
    internal_note: 'CTO flagged as priority candidate. Check notice period with school.',
  },
  {
    studentEmail: 'brice.fotso@internbeacon.dev', offerTitle: 'Full-Stack Developer Intern (Telemedicine)',
    status: 'under_review', appliedDaysAgo: 4, reviewedDaysAgo: 2,
    cover_letter: 'Dear BlueHealth team,\n\nYour mission to digitise patient care in Littoral resonates with me — my mother is a nurse at Laquintinie. I have shipped full-stack features in React and Node.js and am comfortable with the responsibility that health data carries.\n\nBrice Fotso',
  },
  {
    studentEmail: 'brice.fotso@internbeacon.dev', offerTitle: 'Frontend Developer Intern (React)',
    status: 'rejected', appliedDaysAgo: 20, reviewedDaysAgo: 15,
    cover_letter: 'Hello Silicon Mountain Labs,\n\nI follow your meetups online and would love to join the Buea ecosystem for a semester. React is my daily driver.\n\nBrice',
    company_note: 'Strong candidate but we filled all three slots with Buea-based students for logistics reasons. Encouraged to reapply next cohort.',
  },
  {
    studentEmail: 'aisha.bello@internbeacon.dev', offerTitle: 'Data Analyst Intern (Transaction Insights)',
    status: 'shortlisted', appliedDaysAgo: 6, reviewedDaysAgo: 3,
    cover_letter: 'Dear Head of Data,\n\nI medaled in a Kaggle retail-forecasting competition and built a market-price tracker for Mfoundi market that local radio cited. SQL and pandas are my home turf, and fraud-signal analysis is exactly the kind of problem I want to work on.\n\nAisha Bello',
    company_note: 'Kaggle profile verified. SQL exercise scheduled for next week.',
  },
  {
    studentEmail: 'aisha.bello@internbeacon.dev', offerTitle: 'Public Health Data Intern',
    status: 'submitted', appliedDaysAgo: 1,
    cover_letter: 'Dear BlueHealth team,\n\nPublic-health data is where analysis matters most. My Python and statistics background plus trilingual communication (English, French, Fulfulde) would help with clinic onboarding in the North partnerships you mentioned in the press.\n\nAisha Bello',
  },
  {
    studentEmail: 'aisha.bello@internbeacon.dev', offerTitle: 'GIS & Remote Sensing Intern',
    status: 'under_review', appliedDaysAgo: 8, reviewedDaysAgo: 5,
    cover_letter: 'Dear AgroVision,\n\nI have processed Sentinel-2 imagery in a university project on Lake Chad shrinkage and am comfortable in Python. I would love to apply it to cocoa yields.\n\nAisha',
  },
  {
    studentEmail: 'kevin.ngu@internbeacon.dev', offerTitle: 'Network Operations Intern (NOC)',
    status: 'accepted', appliedDaysAgo: 25, reviewedDaysAgo: 20,
    cover_letter: 'Dear Sahel Telecom,\n\nMy CCNA coursework, home lab of salvaged 2960 switches, and volunteer AP deployments at UB have all been preparation for a real NOC. I can commit to the full 24 weeks and the shift schedule.\n\nKevin Ngu',
    company_note: 'Excellent technical interview — best OSI answers of the cohort. Offer extended and accepted. Badge processing started: remind him about the casier judiciaire (bulletin n°3).',
    internal_note: 'Start date aligned with semester break. Assign to day-shift team B (supervisor: Etienne).',
  },
  {
    studentEmail: 'kevin.ngu@internbeacon.dev', offerTitle: 'IT Support & Systems Intern',
    status: 'withdrawn', appliedDaysAgo: 26, reviewedDaysAgo: 24,
    cover_letter: 'Hello Sahel Telecom IT team,\n\nApplying for IT support as well as the NOC role — happy with either.\n\nKevin',
    company_note: 'Candidate withdrew after accepting our NOC internship. Keep on file.',
  },
  {
    studentEmail: 'marie.essomba@internbeacon.dev', offerTitle: 'Credit Analysis Intern',
    status: 'interview_scheduled', appliedDaysAgo: 7, reviewedDaysAgo: 4,
    interview: {
      date: daysFromNow(5) + 'T14:30:00+01:00', type: 'in_person',
      location: 'Mont Fébé Finance HQ, Immeuble T Bella, Boulevard du 20 Mai (face Hilton), Yaoundé — 3rd floor, ask for Mme Atangana',
      notes: 'Case study interview: you will analyse a sample loan file (45 min) then discuss. Bring: CNI, enrollment certificate, 2 passport photos. Dress code: business formal. Arrive 15 min early for building security.',
    },
    cover_letter: 'Madame, Monsieur,\n\nTrésorière de la Junior Entreprise de l\'ESSEC, je gère un budget annuel de 1,2 M FCFA et produis des états mensuels adoptés par le bureau. L\'analyse crédit en microfinance est exactement le métier que je veux apprendre.\n\nMarie Essomba',
    company_note: 'Junior Enterprise treasury experience is a great signal. Case study scheduled.',
  },
  {
    studentEmail: 'marie.essomba@internbeacon.dev', offerTitle: 'Digital Banking Product Intern',
    status: 'submitted', appliedDaysAgo: 2,
    cover_letter: 'Dear Digital Product Manager,\n\nI bank with a USSD-first MFI myself and have opinions about every menu. I would bring both finance coursework and real user empathy to your launch testing.\n\nMarie Essomba',
  },
  {
    studentEmail: 'marie.essomba@internbeacon.dev', offerTitle: 'Social Media & Content Intern',
    status: 'rejected', appliedDaysAgo: 15, reviewedDaysAgo: 12,
    cover_letter: 'Hello Limbe Creative Hub,\n\nExploring a different side of my profile — I run my class association\'s Instagram (1.2k followers).\n\nMarie',
    company_note: 'Nice account but we need someone based in Limbe for shoot days.',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
async function findOrCreateUser(email, role, label) {
  // listUsers is paginated; demo project is small so one page suffices
  const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
  const existing = list?.users?.find(u => u.email === email);
  if (existing) {
    await supabaseAdmin.auth.admin.updateUserById(existing.id, { password: PASSWORD, app_metadata: { role } });
    console.log(`  = ${label} exists (password reset): ${email}`);
    return existing.id;
  }
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email, password: PASSWORD, email_confirm: true, app_metadata: { role },
  });
  if (error) throw new Error(`createUser ${email}: ${error.message}`);
  console.log(`  + ${label} created: ${email}`);
  return data.user.id;
}

async function main() {
  console.log('\n── Seeding companies ──────────────────────────');
  const companyIdByEmail = {}; // email → company_profiles.id
  for (const c of COMPANIES) {
    const userId = await findOrCreateUser(c.email, 'company', c.company_name);
    const profile = {
      user_id: userId, company_name: c.company_name, sector: c.sector, description: c.description,
      city: c.city, address: c.address, phone: c.phone, website_url: c.website_url,
      employee_size: c.employee_size, is_verified: c.is_verified,
      verified_at: c.is_verified ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };
    const { data: existing } = await supabaseAdmin.from('company_profiles').select('id').eq('user_id', userId).maybeSingle();
    if (existing) {
      await supabaseAdmin.from('company_profiles').update(profile).eq('id', existing.id);
      companyIdByEmail[c.email] = existing.id;
    } else {
      const { data, error } = await supabaseAdmin.from('company_profiles').insert(profile).select('id').single();
      if (error) throw new Error(`company_profiles ${c.company_name}: ${error.message}`);
      companyIdByEmail[c.email] = data.id;
    }
  }

  console.log('\n── Seeding offers ─────────────────────────────');
  const offerIdByTitle = {};
  for (const o of OFFERS) {
    const companyId = companyIdByEmail[o.companyEmail];
    const { data: existing } = await supabaseAdmin
      .from('internship_offers').select('id').eq('company_id', companyId).eq('title', o.title).maybeSingle();
    if (existing) {
      offerIdByTitle[o.title] = existing.id;
      console.log(`  = offer exists: ${o.title}`);
      continue;
    }
    const row = {
      company_id: companyId, title: o.title, domain: o.domain, description: o.description,
      responsibilities: o.responsibilities, requirements: o.requirements,
      required_skills: o.required_skills, location: o.location, duration_weeks: o.duration_weeks,
      is_paid: o.is_paid, openings: o.openings, deadline: daysFromNow(o.deadlineDays),
      start_date: daysFromNow(o.deadlineDays + 14), status: 'open',
      views_count: 20 + Math.floor(Math.random() * 180),
    };
    if (o.is_paid && o.stipend_amount) { row.stipend_amount = o.stipend_amount; row.stipend_currency = 'XAF'; }
    const { data, error } = await supabaseAdmin.from('internship_offers').insert(row).select('id').single();
    if (error) throw new Error(`offer ${o.title}: ${error.message}`);
    offerIdByTitle[o.title] = data.id;
    console.log(`  + offer: ${o.title}`);
  }

  console.log('\n── Seeding students + CVs ─────────────────────');
  const studentProfileIdByEmail = {}; // email → student_profiles.id (applications FK target)
  for (const s of STUDENTS) {
    const userId = await findOrCreateUser(s.email, 'student', `${s.first_name} ${s.last_name}`);

    const cvPath = `${userId}.pdf`;
    const pdf = buildSimplePdf(s.cv);
    const { error: upErr } = await supabaseAdmin.storage.from('cvs')
      .upload(cvPath, pdf, { contentType: 'application/pdf', upsert: true });
    if (upErr) throw new Error(`CV upload ${s.email}: ${upErr.message}`);

    const profile = {
      user_id: userId, first_name: s.first_name, last_name: s.last_name,
      university: s.university, faculty: s.faculty, programme: s.programme, study_year: s.study_year,
      phone: s.phone, bio: s.bio, skills: s.skills, languages: s.languages,
      cv_url: cvPath, linkedin_url: s.linkedin_url || null, github_url: s.github_url || null,
      updated_at: new Date().toISOString(),
    };
    const { data: existing } = await supabaseAdmin.from('student_profiles').select('id').eq('user_id', userId).maybeSingle();
    if (existing) {
      await supabaseAdmin.from('student_profiles').update(profile).eq('id', existing.id);
      studentProfileIdByEmail[s.email] = existing.id;
    } else {
      const { data, error } = await supabaseAdmin.from('student_profiles').insert(profile).select('id').single();
      if (error) throw new Error(`student_profiles ${s.email}: ${error.message}`);
      studentProfileIdByEmail[s.email] = data.id;
    }
    console.log(`    CV uploaded: ${cvPath}`);
  }

  console.log('\n── Seeding applications ───────────────────────');
  for (const a of APPLICATIONS) {
    const studentId = studentProfileIdByEmail[a.studentEmail]; // student_profiles.id, not auth uid
    const offerId   = offerIdByTitle[a.offerTitle];
    if (!offerId) { console.warn(`  ! offer not found: ${a.offerTitle}`); continue; }

    const { data: existing } = await supabaseAdmin
      .from('applications').select('id').eq('student_id', studentId).eq('offer_id', offerId).maybeSingle();
    if (existing) { console.log(`  = application exists: ${a.studentEmail.split('@')[0]} → ${a.offerTitle}`); continue; }

    const row = {
      student_id: studentId, offer_id: offerId, status: a.status,
      cover_letter: a.cover_letter, applied_at: daysAgo(a.appliedDaysAgo),
      reviewed_at: a.reviewedDaysAgo ? daysAgo(a.reviewedDaysAgo) : null,
      company_note: a.company_note || null, internal_note: a.internal_note || null,
    };
    if (['accepted', 'rejected', 'withdrawn', 'offer_accepted', 'offer_declined'].includes(a.status)) {
      row.decided_at = daysAgo(Math.max(0, (a.reviewedDaysAgo || 1) - 1));
    }
    if (a.interview) {
      row.interview_date = a.interview.date;
      row.interview_type = a.interview.type;
      row.interview_location = a.interview.location;
      row.interview_notes = a.interview.notes;
    }
    const { error } = await supabaseAdmin.from('applications').insert(row);
    if (error) throw new Error(`application ${a.studentEmail} → ${a.offerTitle}: ${error.message}`);
    console.log(`  + ${a.studentEmail.split('@')[0]} → ${a.offerTitle} [${a.status}]`);
  }

  console.log('\n✔ Done. All accounts use password: ' + PASSWORD + '\n');
}

main().catch(err => { console.error('\n✖ Seed failed:', err.message); process.exit(1); });
