const { PrismaClient, Role, ApplicationStatus } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const schools = [
  { name: 'University of Yaoundé I', city: 'Yaoundé', website: 'https://www.uy1.uninet.cm', type: 'University' },
  { name: 'University of Yaoundé II (Soa)', city: 'Soa', website: 'https://www.univ-yaounde2.org', type: 'University' },
  { name: 'University of Douala', city: 'Douala', website: 'https://www.univ-douala.com', type: 'University' },
  { name: 'University of Buea', city: 'Buea', website: 'https://www.ubuea.cm', type: 'University' },
  { name: 'University of Dschang', city: 'Dschang', website: 'https://www.univ-dschang.org', type: 'University' },
  { name: 'University of Bamenda', city: 'Bamenda', website: 'https://www.uniba.cm', type: 'University' },
  { name: 'University of Maroua', city: 'Maroua', website: 'https://www.univ-maroua.cm', type: 'University' },
  { name: 'University of Ngaoundéré', city: 'Ngaoundéré', website: 'https://www.univ-ndere.cm', type: 'University' },
  { name: 'University of Bafoussam', city: 'Bafoussam', website: 'https://www.univ-bafoussam.org', type: 'University' },
  { name: 'Catholic University of Central Africa (UCAC)', city: 'Yaoundé', website: 'https://www.ucac-icy.net', type: 'University' },
  { name: 'The ICT University', city: 'Yaoundé', website: 'https://www.ictuniversity.org', type: 'University' },
  { name: 'Institut Universitaire de la Côte (IUC)', city: 'Douala', website: 'https://www.iuc-univ.com', type: 'Institute' },
  { name: 'National Advanced School of Engineering, Yaoundé (ENSPY)', city: 'Yaoundé', website: 'https://www.polytechnique.cm', type: 'Institute' },
  { name: 'National Advanced School of Engineering, Douala (ENSPD)', city: 'Douala', website: null, type: 'Institute' },
  { name: 'National Higher Polytechnic Institute, University of Bamenda', city: 'Bamenda', website: null, type: 'Institute' },
  { name: 'Saint Jerome Catholic University Institute of Douala', city: 'Douala', website: null, type: 'Institute' },
];

const companies = [
  { name: 'MTN Cameroon', industry: 'Telecommunications', city: 'Douala', website: 'https://www.mtn.cm', description: 'Leading telecom operator in Cameroon.' },
  { name: 'Orange Cameroun', industry: 'Telecommunications', city: 'Douala', website: 'https://www.orange.cm', description: 'Telecom and digital services company.' },
  { name: 'CAMTEL', industry: 'Telecommunications', city: 'Yaoundé', website: 'https://www.camtel.cm', description: 'National telecommunications carrier.' },
  { name: 'Nexttel', industry: 'Telecommunications', city: 'Yaoundé', website: 'https://www.nexttel.cm', description: 'Mobile telecom operator in Cameroon.' },
  { name: 'Afriland First Bank', industry: 'Banking', city: 'Douala', website: 'https://www.afrilandfirstbank.com', description: 'Major commercial bank.' },
  { name: 'BICEC', industry: 'Banking', city: 'Douala', website: 'https://www.bicec.com', description: 'Retail and corporate banking services.' },
  { name: 'Ecobank Cameroun', industry: 'Banking', city: 'Douala', website: 'https://www.ecobank.com/cm', description: 'Pan-African banking group branch.' },
  { name: 'UBA Cameroon', industry: 'Banking', city: 'Douala', website: 'https://www.ubagroup.com/cameroon', description: 'International commercial bank.' },
  { name: 'Maviance PLC', industry: 'Fintech', city: 'Yaoundé', website: 'https://www.maviance.com', description: 'Digital payment and fintech solutions.' },
  { name: 'Ejara', industry: 'Fintech', city: 'Douala', website: 'https://www.ejara.io', description: 'Consumer fintech startup.' },
  { name: 'Jumia Cameroon', industry: 'E-commerce', city: 'Douala', website: 'https://www.jumia.cm', description: 'E-commerce marketplace.' },
  { name: 'Deloitte Cameroon', industry: 'Consulting', city: 'Douala', website: 'https://www2.deloitte.com/cm/en.html', description: 'Consulting and audit services.' },
  { name: 'PwC Cameroon', industry: 'Consulting', city: 'Douala', website: 'https://www.pwc.com/cm/en.html', description: 'Professional services firm.' },
  { name: 'KPMG Cameroon', industry: 'Consulting', city: 'Douala', website: 'https://kpmg.com/cm/en/home.html', description: 'Audit and advisory services.' },
  { name: 'ENEO Cameroon', industry: 'Energy', city: 'Douala', website: 'https://eneocameroon.cm', description: 'Electric utility provider.' },
  { name: 'SNH', industry: 'Oil & Gas', city: 'Yaoundé', website: 'https://www.snh.cm', description: 'National hydrocarbon company.' },
  { name: 'TRADEX', industry: 'Energy', city: 'Yaoundé', website: 'https://www.tradexcameroon.com', description: 'Petroleum distribution company.' },
  { name: 'Boissons du Cameroun (SABC)', industry: 'FMCG', city: 'Douala', website: 'https://www.sabc.cm', description: 'Food and beverage producer.' },
  { name: 'Nestlé Cameroun', industry: 'FMCG', city: 'Douala', website: 'https://www.nestle-cwa.com/en/cameroon', description: 'Consumer goods company.' },
  { name: 'AGL Cameroun', industry: 'Logistics', city: 'Douala', website: 'https://www.aglgroup.com', description: 'Logistics and transport services.' },
];

const categories = ['Software Engineering', 'Data Science', 'Product Management', 'Marketing', 'Finance', 'Operations', 'Design'];

const sampleSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Communication', 'Excel', 'UI/UX'];

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomSample = (arr, count) => {
  const clone = [...arr];
  const out = [];
  for (let i = 0; i < count && clone.length; i += 1) {
    const idx = Math.floor(Math.random() * clone.length);
    out.push(clone.splice(idx, 1)[0]);
  }
  return out;
};

async function main() {
  console.log('Seeding database...');

  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.match.deleteMany();
  await prisma.application.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.student.deleteMany();
  await prisma.company.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.create({
    data: {
      email: 'admin@internbeacon.cm',
      password: adminPassword,
      name: 'InternBeacon Admin',
      role: Role.ADMIN,
    },
  });

  const schoolRows = [];
  for (const s of schools) {
    const row = await prisma.school.create({ data: s });
    schoolRows.push(row);
  }

  const companyRows = [];
  for (const [index, c] of companies.entries()) {
    const password = await bcrypt.hash('Company123!', 10);
    const user = await prisma.user.create({
      data: {
        email: `company${index + 1}@internbeacon.cm`,
        password,
        name: c.name,
        role: Role.COMPANY,
        avatarUrl: null,
      },
    });

    const company = await prisma.company.create({
      data: {
        userId: user.id,
        description: c.description,
        website: c.website,
        industry: c.industry,
        city: c.city,
        logoUrl: null,
      },
      include: { user: true },
    });

    companyRows.push(company);
  }

  const studentRows = [];
  for (let i = 0; i < 60; i += 1) {
    const school = randomPick(schoolRows);
    const password = await bcrypt.hash('Student123!', 10);

    const user = await prisma.user.create({
      data: {
        email: `student${i + 1}@internbeacon.cm`,
        password,
        name: `Student ${i + 1}`,
        role: Role.STUDENT,
      },
    });

    const skills = randomSample(sampleSkills, Math.floor(Math.random() * 4) + 3);

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        schoolId: school.id,
        bio: `Motivated student from ${school.name} seeking internship opportunities in ${randomPick(categories)}.`,
        city: school.city,
        skills,
        profileStrength: 70 + Math.floor(Math.random() * 31),
      },
      include: { user: true, school: true },
    });

    studentRows.push(student);
  }

  const offerRows = [];
  for (const company of companyRows) {
    const offersCount = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < offersCount; i += 1) {
      const category = randomPick(categories);
      const offer = await prisma.offer.create({
        data: {
          companyId: company.id,
          title: `${category} Intern`,
          description: `Join ${company.user.name} as a ${category} intern in ${company.city}. You will work on impactful projects with mentorship and growth opportunities.`,
          salary: `${80000 + Math.floor(Math.random() * 220000)} XAF / month`,
          location: company.city,
          category,
          languages: randomSample(['English', 'French'], Math.random() > 0.5 ? 2 : 1),
        },
        include: { company: { include: { user: true } } },
      });
      offerRows.push(offer);
    }
  }

  for (const student of studentRows) {
    const appsCount = Math.floor(Math.random() * 6);
    const chosenOffers = randomSample(offerRows, appsCount);

    for (const offer of chosenOffers) {
      const status = randomPick([
        ApplicationStatus.PENDING,
        ApplicationStatus.PENDING,
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.REJECTED,
      ]);

      const app = await prisma.application.create({
        data: {
          studentId: student.id,
          offerId: offer.id,
          status,
          coverLetter: `Dear ${offer.company.user.name}, I am excited to apply for the ${offer.title} position.`,
          availability: 'Immediate',
        },
      });

      const score = Number((0.5 + Math.random() * 0.5).toFixed(2));
      await prisma.match.create({
        data: {
          studentId: student.id,
          offerId: offer.id,
          score,
        },
      });

      if (status === ApplicationStatus.SHORTLISTED) {
        await prisma.notification.create({
          data: {
            userId: student.userId,
            message: `Good news! You were shortlisted for ${offer.title} at ${offer.company.user.name}.`,
            type: 'IN_APP',
            read: false,
          },
        });
      }

      if (Math.random() > 0.8) {
        await prisma.notification.create({
          data: {
            userId: student.userId,
            message: `Application update for ${offer.title}: ${app.status}.`,
            type: 'IN_APP',
            read: Math.random() > 0.5,
          },
        });
      }
    }
  }

  console.log(`Seed complete:\n- Schools: ${schoolRows.length}\n- Companies: ${companyRows.length}\n- Students: ${studentRows.length}\n- Offers: ${offerRows.length}`);
  console.log('Sample credentials:');
  console.log('- admin@internbeacon.cm / Admin123!');
  console.log('- student1@internbeacon.cm / Student123!');
  console.log('- company1@internbeacon.cm / Company123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
