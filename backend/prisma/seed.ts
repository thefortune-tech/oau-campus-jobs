
import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "CampusDemo2026!";

const employers = [
  {
    email: "employer1@oaucampusjobs.test",
    name: "Adeola Adebayo",
    organizationName: "CampusTech Solutions",
    description: "Technology support and digital services for students and small businesses.",
    phone: "08030000001",
  },
  {
    email: "employer2@oaucampusjobs.test",
    name: "Tunde Balogun",
    organizationName: "Great Ife Tutorials",
    description: "Academic tutoring and examination preparation services.",
    phone: "08030000002",
  },
  {
    email: "employer3@oaucampusjobs.test",
    name: "Mariam Yusuf",
    organizationName: "Ife Creative Studio",
    description: "Graphic design, branding and digital content services.",
    phone: "08030000003",
  },
  {
    email: "employer4@oaucampusjobs.test",
    name: "Chinedu Okafor",
    organizationName: "Campus Essentials",
    description: "Retail and student convenience services around campus.",
    phone: "08030000004",
  },
  {
    email: "employer5@oaucampusjobs.test",
    name: "Funmi Oladipo",
    organizationName: "Ife Mobility Services",
    description: "Local transport coordination and campus logistics.",
    phone: "08030000005",
  },
];

const students = [
  { email: "student1@oaucampusjobs.test", name: "Demo Student One", department: "Computer Science", level: "300", skills: ["Dart", "Flutter", "Git"] },
  { email: "student2@oaucampusjobs.test", name: "Demo Student Two", department: "Software Engineering", level: "200", skills: ["TypeScript", "Node.js", "SQL"] },
  { email: "student3@oaucampusjobs.test", name: "Demo Student Three", department: "Electrical Engineering", level: "300", skills: ["Mathematics", "Tutoring", "Research"] },
  { email: "student4@oaucampusjobs.test", name: "Demo Student Four", department: "Accounting", level: "200", skills: ["Excel", "Bookkeeping"] },
  { email: "student5@oaucampusjobs.test", name: "Demo Student Five", department: "English", level: "300", skills: ["Writing", "Editing", "Research"] },
  { email: "student6@oaucampusjobs.test", name: "Demo Student Six", department: "Fine and Applied Arts", level: "200", skills: ["Graphic Design", "Canva"] },
  { email: "student7@oaucampusjobs.test", name: "Demo Student Seven", department: "Physics", level: "300", skills: ["Data Entry", "Excel"] },
  { email: "student8@oaucampusjobs.test", name: "Demo Student Eight", department: "Economics", level: "400", skills: ["Communication", "Sales"] },
  { email: "student9@oaucampusjobs.test", name: "Demo Student Nine", department: "Computer Science", level: "400", skills: ["HTML", "CSS", "JavaScript"] },
  { email: "student10@oaucampusjobs.test", name: "Demo Student Ten", department: "Education", level: "200", skills: ["Teaching", "Public Speaking"] },
];

const jobData = [
  { title: "Junior Flutter Developer", description: "Assist with building and maintaining mobile application interfaces. Applicants should understand basic Flutter widgets and Dart.", category: "Technology", location: "OAU Campus, Ile-Ife", employmentType: "PART_TIME" as const, compensation: "₦60,000 monthly" },
  { title: "IT Support Assistant", description: "Help students troubleshoot common computer problems, install software and resolve basic connectivity issues.", category: "Technology", location: "OAU Campus, Ile-Ife", employmentType: "PART_TIME" as const, compensation: "₦40,000 monthly" },
  { title: "Frontend Development Intern", description: "Assist with responsive web interfaces using HTML, CSS and JavaScript while learning practical software development.", category: "Technology", location: "Ile-Ife", employmentType: "INTERNSHIP" as const, compensation: "₦50,000 monthly" },
  { title: "Computer Laboratory Assistant", description: "Support laboratory users, maintain orderly workstations and help with basic computer operations during practical sessions.", category: "Technology", location: "OAU Campus, Ile-Ife", employmentType: "PART_TIME" as const, compensation: "₦35,000 monthly" },
  { title: "Mathematics Tutor", description: "Provide individual or small-group tutoring in introductory mathematics and help students practise problem-solving techniques.", category: "Education", location: "OAU Campus, Ile-Ife", employmentType: "PART_TIME" as const, compensation: "₦3,000 per session" },
  { title: "Physics Tutorial Assistant", description: "Assist students with introductory physics concepts, worked examples and preparation for continuous assessment tests.", category: "Education", location: "Ile-Ife", employmentType: "PART_TIME" as const, compensation: "₦25,000 monthly" },
  { title: "English Language Tutor", description: "Help learners improve grammar, writing, reading comprehension and preparation for English language examinations.", category: "Education", location: "OAU Campus, Ile-Ife", employmentType: "PART_TIME" as const, compensation: "₦2,500 per session" },
  { title: "Academic Research Assistant", description: "Assist with literature searches, reference formatting, spreadsheet organization and other supervised academic research tasks.", category: "Research", location: "Ile-Ife", employmentType: "TEMPORARY" as const, compensation: "₦30,000 monthly" },
  { title: "Social Media Assistant", description: "Help plan posts, write captions, schedule content and track engagement for a small campus-focused business.", category: "Marketing", location: "Remote", employmentType: "PART_TIME" as const, compensation: "₦35,000 monthly" },
  { title: "Graphic Design Assistant", description: "Create simple promotional graphics and social media designs using Canva or other graphic design tools.", category: "Design", location: "Ile-Ife", employmentType: "CONTRACT" as const, compensation: "₦5,000 per design" },
  { title: "Video Editing Assistant", description: "Edit short promotional videos, organize footage and add captions and transitions for social media content.", category: "Design", location: "Remote", employmentType: "CONTRACT" as const, compensation: "₦7,000 per video" },
  { title: "Data Entry Assistant", description: "Enter and verify business records in spreadsheets, maintain accurate data and report inconsistencies to a supervisor.", category: "Administration", location: "OAU Campus, Ile-Ife", employmentType: "TEMPORARY" as const, compensation: "₦30,000 monthly" },
  { title: "Bookkeeping Assistant", description: "Help organize receipts, update basic financial spreadsheets and maintain records under the supervision of an accountant.", category: "Finance", location: "Ile-Ife", employmentType: "PART_TIME" as const, compensation: "₦40,000 monthly" },
  { title: "Campus Sales Representative", description: "Promote student essentials, answer customer questions and record sales for a campus retail business.", category: "Sales", location: "OAU Campus, Ile-Ife", employmentType: "PART_TIME" as const, compensation: "₦25,000 monthly plus commission" },
  { title: "Retail Shop Assistant", description: "Assist customers, arrange merchandise, track inventory and maintain a clean and organized retail space.", category: "Retail", location: "Ile-Ife", employmentType: "PART_TIME" as const, compensation: "₦30,000 monthly" },
  { title: "Customer Service Assistant", description: "Respond to customer enquiries, maintain service records and direct complex complaints to the appropriate staff member.", category: "Customer Service", location: "Remote", employmentType: "PART_TIME" as const, compensation: "₦45,000 monthly" },
  { title: "Campus Transport Coordinator", description: "Help coordinate transport requests, communicate pickup details and maintain daily trip records for a local service.", category: "Transport", location: "OAU Campus, Ile-Ife", employmentType: "PART_TIME" as const, compensation: "₦35,000 monthly" },
  { title: "Event Support Assistant", description: "Help with event setup, attendee registration, logistics and post-event organization for campus events.", category: "Events", location: "OAU Campus, Ile-Ife", employmentType: "TEMPORARY" as const, compensation: "₦5,000 per event" },
  { title: "Content Writing Assistant", description: "Write and proofread short articles, product descriptions and announcements while following an editorial brief.", category: "Writing", location: "Remote", employmentType: "CONTRACT" as const, compensation: "₦4,000 per article" },
  { title: "Student Photography Assistant", description: "Assist with event photography, arrange equipment and organize selected photographs for delivery to clients.", category: "Media", location: "Ile-Ife", employmentType: "CONTRACT" as const, compensation: "₦10,000 per event" },
];

async function main() {
  const passwordHash = await hash(DEMO_PASSWORD, 12);

  // Create or update a dedicated demo administrator.
  const admin = await prisma.user.upsert({
    where: { email: "admin@oaucampusjobs.test" },
    update: {
      name: "Demo Administrator",
      passwordHash,
      role: "ADMIN",
    },
    create: {
      name: "Demo Administrator",
      email: "admin@oaucampusjobs.test",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Demo admin ready: ${admin.email}`);

  // Create verified demo employers and their profiles.
  const employerUsers = [];

  for (const employer of employers) {
    const user = await prisma.user.upsert({
      where: { email: employer.email },
      update: {
        name: employer.name,
        passwordHash,
        role: "EMPLOYER",
      },
      create: {
        name: employer.name,
        email: employer.email,
        passwordHash,
        role: "EMPLOYER",
      },
    });

    const profile = await prisma.employerProfile.upsert({
      where: { userId: user.id },
      update: {
        organizationName: employer.organizationName,
        description: employer.description,
        phone: employer.phone,
        verificationStatus: "VERIFIED",
      },
      create: {
        userId: user.id,
        organizationName: employer.organizationName,
        description: employer.description,
        phone: employer.phone,
        verificationStatus: "VERIFIED",
      },
    });

    employerUsers.push(user);
    console.log(`Employer ready: ${profile.organizationName}`);
  }

  // Create demo students and their profiles.
  const studentUsers = [];

  for (const student of students) {
    const user = await prisma.user.upsert({
      where: { email: student.email },
      update: {
        name: student.name,
        passwordHash,
        role: "STUDENT",
      },
      create: {
        name: student.name,
        email: student.email,
        passwordHash,
        role: "STUDENT",
      },
    });

    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        department: student.department,
        level: student.level,
        skills: student.skills,
      },
      create: {
        userId: user.id,
        department: student.department,
        level: student.level,
        skills: student.skills,
      },
    });

    studentUsers.push(user);
  }

  console.log(`Students ready: ${studentUsers.length}`);

  // Seed jobs by matching their employer and title.
  // Existing matching jobs are updated rather than duplicated.
  const seededJobs = [];

  for (let i = 0; i < jobData.length; i++) {
    const item = jobData[i];
    const employer = employerUsers[i % employerUsers.length];
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30 + i);

    const existing = await prisma.job.findFirst({
      where: {
        employerId: employer.id,
        title: item.title,
      },
    });

    const data = {
      ...item,
      employerId: employer.id,
      status: "OPEN" as const,
      deadline,
    };

    const job = existing
      ? await prisma.job.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.job.create({ data });

    seededJobs.push(job);
  }

  console.log(`Jobs ready: ${seededJobs.length}`);

  // Create demo applications with different statuses.
  const applicationStatuses = [
    "PENDING",
    "SHORTLISTED",
    "ACCEPTED",
    "REJECTED",
  ] as const;

  let applicationCount = 0;

  for (let i = 0; i < 12; i++) {
    const student = studentUsers[i % studentUsers.length];
    const job = seededJobs[i % seededJobs.length];

    await prisma.application.upsert({
      where: {
        studentId_jobId: {
          studentId: student.id,
          jobId: job.id,
        },
      },
      update: {
        coverMessage: `Demo application ${i + 1}: I am interested in this opportunity and believe my skills are a good match.`,
        status: applicationStatuses[i % applicationStatuses.length],
      },
      create: {
        studentId: student.id,
        jobId: job.id,
        coverMessage: `Demo application ${i + 1}: I am interested in this opportunity and believe my skills are a good match.`,
        status: applicationStatuses[i % applicationStatuses.length],
      },
    });

    applicationCount++;
  }

  console.log(`Applications ready: ${applicationCount}`);

  // Save demo jobs for students.
  let savedCount = 0;

  for (let i = 0; i < 10; i++) {
    const student = studentUsers[i];
    const job = seededJobs[(i + 3) % seededJobs.length];

    await prisma.savedJob.upsert({
      where: {
        studentId_jobId: {
          studentId: student.id,
          jobId: job.id,
        },
      },
      update: {},
      create: {
        studentId: student.id,
        jobId: job.id,
      },
    });

    savedCount++;
  }

  console.log(`Saved jobs ready: ${savedCount}`);

  // Add a few reports for the admin dashboard.
  const reportData = [
    {
      job: seededJobs[2],
      reporter: studentUsers[0],
      reason: "The contact details in this listing need to be verified.",
    },
    {
      job: seededJobs[8],
      reporter: studentUsers[1],
      reason: "The compensation details may need clarification.",
    },
    {
      job: seededJobs[15],
      reporter: studentUsers[2],
      reason: "Please verify that this listing is still available.",
    },
  ];

  for (const item of reportData) {
    const existing = await prisma.reportedJob.findFirst({
      where: {
        jobId: item.job.id,
        reporterId: item.reporter.id,
        reason: item.reason,
      },
    });

    if (existing) {
      await prisma.reportedJob.update({
        where: { id: existing.id },
        data: { status: "PENDING", reviewedAt: null },
      });
    } else {
      await prisma.reportedJob.create({
        data: {
          jobId: item.job.id,
          reporterId: item.reporter.id,
          reason: item.reason,
        },
      });
    }
  }

  console.log("Demo reports ready.");
  console.log("\nDatabase seeding completed successfully.");
  console.log("Demo account password:", DEMO_PASSWORD);
  console.log("Demo admin email: admin@oaucampusjobs.test");
}

main()
  .catch((error: unknown) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
