import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { ROLES, ROLE_PERMISSIONS } from '@/lib/constants';

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.userRole.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.eventFeedback.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.waitlist.deleteMany();
  await prisma.eventRegistration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.projectReview.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.roadmapStep.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.teamPosition.deleteMany();
  await prisma.clubMembership.deleteMany();
  await prisma.club.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('✨ Creating roles...');
  const roles = await Promise.all(
    Object.entries(ROLES).map(([key, name]) =>
      prisma.role.create({
        data: {
          name,
          description: `${name} role`,
          permissions: ROLE_PERMISSIONS[name] || [],
        },
      })
    )
  );

  const roleMap = Object.fromEntries(
    roles.map((role) => [role.name, role.id])
  );

  console.log('🏢 Creating departments...');
  const departments = await Promise.all([
    prisma.department.create({
      data: { name: 'Computer Science', code: 'CS' },
    }),
    prisma.department.create({
      data: { name: 'Information Technology', code: 'IT' },
    }),
    prisma.department.create({
      data: { name: 'Electronics', code: 'EC' },
    }),
    prisma.department.create({
      data: { name: 'Mechanical', code: 'ME' },
    }),
  ]);

  console.log('👥 Creating users...');
  // Admin
  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: await hashPassword('password123'),
      studentId: 'ADM001',
      verified: true,
      active: true,
    },
  });

  await prisma.userRole.create({
    data: { userId: admin.id, roleId: roleMap.SUPER_ADMIN },
  });

  // Faculty Coordinator
  const faculty = await prisma.user.create({
    data: {
      firstName: 'Dr.',
      lastName: 'Faculty',
      email: 'faculty@example.com',
      password: await hashPassword('password123'),
      verified: true,
      active: true,
    },
  });

  await prisma.userRole.create({
    data: { userId: faculty.id, roleId: roleMap.FACULTY_COORDINATOR },
  });

  // Club Admin
  const clubAdmin = await prisma.user.create({
    data: {
      firstName: 'Club',
      lastName: 'Admin',
      email: 'clubadmin@example.com',
      password: await hashPassword('password123'),
      verified: true,
      active: true,
    },
  });

  // Students
  const students = await Promise.all([
    prisma.user.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: await hashPassword('password123'),
        studentId: 'CS2023001',
        department: 'Computer Science',
        academicYear: 2,
        semester: 3,
        verified: true,
        active: true,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: await hashPassword('password123'),
        studentId: 'CS2023002',
        department: 'Computer Science',
        academicYear: 2,
        semester: 3,
        verified: true,
        active: true,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        password: await hashPassword('password123'),
        studentId: 'IT2023003',
        department: 'Information Technology',
        academicYear: 1,
        semester: 2,
        verified: true,
        active: true,
      },
    }),
    prisma.user.create({
      data: {
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob@example.com',
        password: await hashPassword('password123'),
        studentId: 'CS2023004',
        department: 'Computer Science',
        academicYear: 3,
        semester: 5,
        verified: true,
        active: true,
      },
    }),
  ]);

  // Assign student role to all students
  const studentRole = roleMap.STUDENT;
  await Promise.all(
    students.map((student) =>
      prisma.userRole.create({
        data: { userId: student.id, roleId: studentRole },
      })
    )
  );

  console.log('🏛️ Creating clubs...');
  const clubs = await Promise.all([
    prisma.club.create({
      data: {
        name: 'AI & ML Club',
        slug: 'ai-ml-club',
        description: 'Explore artificial intelligence and machine learning',
        domain: 'AI/ML',
        departmentId: departments[0].id,
        totalMembers: 2,
      },
    }),
    prisma.club.create({
      data: {
        name: 'Web Development Club',
        slug: 'web-dev-club',
        description: 'Learn modern web development technologies',
        domain: 'Web Development',
        departmentId: departments[0].id,
        totalMembers: 2,
      },
    }),
    prisma.club.create({
      data: {
        name: 'Cyber Security Club',
        slug: 'cyber-security-club',
        description: 'Understand cybersecurity and ethical hacking',
        domain: 'Cybersecurity',
        departmentId: departments[1].id,
        totalMembers: 1,
      },
    }),
  ]);

  console.log('👨‍💼 Adding club memberships...');
  await Promise.all([
    // AI & ML Club
    prisma.clubMembership.create({
      data: { userId: students[0].id, clubId: clubs[0].id, status: 'active' },
    }),
    prisma.clubMembership.create({
      data: { userId: students[1].id, clubId: clubs[0].id, status: 'active' },
    }),
    // Web Dev Club
    prisma.clubMembership.create({
      data: { userId: students[1].id, clubId: clubs[1].id, status: 'active' },
    }),
    prisma.clubMembership.create({
      data: { userId: students[2].id, clubId: clubs[1].id, status: 'active' },
    }),
    // Cyber Security Club
    prisma.clubMembership.create({
      data: { userId: students[3].id, clubId: clubs[2].id, status: 'active' },
    }),
  ]);

  // Assign club admin and coordinator roles
  await prisma.userRole.create({
    data: {
      userId: students[0].id,
      roleId: roleMap.CLUB_ADMIN,
      clubId: clubs[0].id,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: students[1].id,
      roleId: roleMap.CLUB_COORDINATOR,
      clubId: clubs[1].id,
    },
  });

  console.log('🎤 Creating events...');
  const now = new Date();
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Introduction to Machine Learning',
        description: 'Learn the basics of machine learning and neural networks',
        clubId: clubs[0].id,
        eventType: 'Workshop',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        startTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        venue: 'Conference Hall A',
        capacity: 50,
        registrationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        status: 'published',
      },
    }),
    prisma.event.create({
      data: {
        title: 'Web Development Bootcamp',
        description: 'Hands-on bootcamp for modern web development',
        clubId: clubs[1].id,
        eventType: 'Bootcamp',
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        startTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        endTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        venue: 'Lab 2',
        capacity: 30,
        registrationDeadline: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        status: 'published',
      },
    }),
  ]);

  console.log('📝 Creating event registrations...');
  await Promise.all([
    prisma.eventRegistration.create({
      data: { eventId: events[0].id, userId: students[0].id },
    }),
    prisma.eventRegistration.create({
      data: { eventId: events[0].id, userId: students[2].id },
    }),
    prisma.eventRegistration.create({
      data: { eventId: events[1].id, userId: students[1].id },
    }),
  ]);

  console.log('📚 Creating learning resources...');
  await Promise.all([
    prisma.learningResource.create({
      data: {
        title: 'Python Basics',
        description: 'Introduction to Python programming',
        resourceType: 'tutorial',
        domain: 'Python',
        difficulty: 'beginner',
        creatorId: faculty.id,
        status: 'published',
      },
    }),
    prisma.learningResource.create({
      data: {
        title: 'React Fundamentals',
        description: 'Learn React from the ground up',
        resourceType: 'video',
        domain: 'Web Development',
        technology: 'React',
        difficulty: 'intermediate',
        clubId: clubs[1].id,
        creatorId: students[1].id,
        status: 'published',
      },
    }),
  ]);

  console.log('🛣️ Creating learning roadmaps...');
  const roadmapJava = await prisma.roadmap.create({
    data: {
      title: 'Java Development',
      domain: 'Java',
      steps: {
        create: [
          { order: 1, title: 'Java Basics', description: 'Core Java fundamentals' },
          { order: 2, title: 'OOP Concepts', description: 'Object-oriented programming' },
          { order: 3, title: 'Collections', description: 'Java collections framework' },
        ],
      },
    },
  });

  console.log('🛠️ Creating tools directory...');
  await Promise.all([
    prisma.tool.create({
      data: {
        name: 'Visual Studio Code',
        category: 'IDE',
        purpose: 'Code editor',
        license: 'MIT',
        difficulty: 'beginner',
        platform: ['Windows', 'Mac', 'Linux'],
      },
    }),
    prisma.tool.create({
      data: {
        name: 'Git',
        category: 'Version Control',
        purpose: 'Version control system',
        license: 'GPL',
        difficulty: 'intermediate',
        platform: ['Windows', 'Mac', 'Linux'],
      },
    }),
  ]);

  console.log('📢 Creating announcements...');
  await Promise.all([
    prisma.announcement.create({
      data: {
        title: 'Welcome to DIGITwinTHON',
        content: 'Welcome to the centralized club management platform',
        category: 'news',
        priority: 'important',
        publishDate: new Date(),
      },
    }),
    prisma.announcement.create({
      data: {
        title: 'AI & ML Club Meeting',
        content: 'General body meeting this Friday at 5 PM',
        category: 'event',
        clubId: clubs[0].id,
        publishDate: new Date(),
      },
    }),
  ]);

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
