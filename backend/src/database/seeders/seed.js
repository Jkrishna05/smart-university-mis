const bcrypt = require('bcryptjs');
const { User, Student, Faculty, Admin, Department, Course, CourseOffering, Enrollment, Attendance, Exam, Result, AuditLog, Fee, Hostel, Book, LibraryBorrow, Inventory, Message, Event } = require('../../models');

const rawFirstNames = [
  'Aadhya', 'Aarav', 'Aarohi', 'Aayan', 'Abhinav', 'Aditi', 'Aditya', 'Advaith', 'Advik', 'Ahana',
  'Alok', 'Amit', 'Ananya', 'Angel', 'Anika', 'Anvi', 'Arjun', 'Atharv', 'Avani', 'Bhavya',
  'Brijesh', 'Chandan', 'Deepak', 'Dev', 'Diya', 'Divya', 'Dolly', 'Ekta', 'Farah', 'Gaurav',
  'Geeta', 'Harsh', 'Hema', 'Indu', 'Ira', 'Isha', 'Ishaan', 'Joshi', 'Juhi', 'Jyoti',
  'Kabir', 'Kajal', 'Karan', 'Kartik', 'Kavya', 'Khushi', 'Kiran', 'Kriti', 'Krishna', 'Lata',
  'Leela', 'Madhu', 'Manish', 'Megha', 'Mona', 'Myra', 'Navya', 'Neha', 'Nikhil', 'Nisha',
  'Pari', 'Payal', 'Pooja', 'Pranav', 'Prisha', 'Priya', 'Rahul', 'Rashmi', 'Reyansh', 'Ritvik',
  'Ritu', 'Riya', 'Rohan', 'Rudra', 'Sai', 'Sameer', 'Sara', 'Saurabh', 'Shaurya', 'Siddharth',
  'Simran', 'Siya', 'Sneha', 'Suresh', 'Swati', 'Tanmay', 'Tanvi', 'Tarun', 'Tushar', 'Umesh',
  'Varun', 'Vihaan', 'Vikram', 'Vineet', 'Vivaan', 'Waman', 'Yash', 'Yogesh', 'Zahir', 'Kavit'
];

const rawLastNames = [
  'Agarwal', 'Bansal', 'Bhasin', 'Bhat', 'Chawla', 'Chopda', 'Choudhary', 'Deshmukh', 'Dubey', 'Dutt',
  'Ekta', 'Ganguly', 'Geeta', 'Gupta', 'Hegde', 'Iyengar', 'Joshi', 'Kapoor', 'Kartik', 'Kaushik',
  'Kulkarni', 'Kumar', 'Mahajan', 'Malhotra', 'Mehta', 'Mishra', 'Nair', 'Pandey', 'Patel', 'Payal',
  'Pillai', 'Rao', 'Rathore', 'Reddy', 'Saxena', 'Shah', 'Sharma', 'Shukla', 'Singh', 'Srivastava',
  'Thakur', 'Trivedi', 'Verma', 'Yadav', 'Aarav', 'Aditya', 'Amit', 'Ananya', 'Arjun', 'Bhavya'
];

const seedDatabase = async (force = false) => {
  try {
    const userCount = await User.count();
    if (userCount > 10 && !force) {
      console.log('📦 Database already populated. Skipping...');
      return;
    }

    console.log('🌱 Seeding OIT Database: Alphabetically sorted Section A & Section B Students...');
    const salt = await bcrypt.genSalt(10);

    if (force || userCount > 0) {
      await Event.destroy({ where: {}, truncate: false });
      await Message.destroy({ where: {}, truncate: false });
      await Inventory.destroy({ where: {}, truncate: false });
      await LibraryBorrow.destroy({ where: {}, truncate: false });
      await Book.destroy({ where: {}, truncate: false });
      await Hostel.destroy({ where: {}, truncate: false });
      await Fee.destroy({ where: {}, truncate: false });
      await AuditLog.destroy({ where: {}, truncate: false });
      await Result.destroy({ where: {}, truncate: false });
      await Attendance.destroy({ where: {}, truncate: false });
      await Enrollment.destroy({ where: {}, truncate: false });
      await Exam.destroy({ where: {}, truncate: false });
      await CourseOffering.destroy({ where: {}, truncate: false });
      await Course.destroy({ where: {}, truncate: false });
      await Student.destroy({ where: {}, truncate: false });
      await Faculty.destroy({ where: {}, truncate: false });
      await Admin.destroy({ where: {}, truncate: false });
      await User.destroy({ where: {}, truncate: false });
      await Department.destroy({ where: {}, truncate: false });
    }

    // 1. DEPARTMENTS
    const departments = await Department.bulkCreate([
      { department_name: 'Computer Science & Engineering' },
      { department_name: 'Electronics & Communication' },
      { department_name: 'Mechanical Engineering' }
    ]);
    const cseDept = departments[0];

    // Passwords
    const adminPass = await bcrypt.hash('Admin@123', salt);
    const facultyPass = await bcrypt.hash('Faculty@123', salt);
    const studentPass = await bcrypt.hash('Student@123', salt);

    // 2. ADMIN USER
    const adminUser = await User.create({
      username: 'Dr. Rajesh Kumar (Admin)',
      email: 'admin@oit.edu',
      password: adminPass,
      role: 'Admin',
      status: 'active'
    });
    await Admin.create({ user_id: adminUser.id, designation: 'System Administrator' });

    // 3. 10 FACULTY MEMBERS
    const facultyList = [
      { name: 'Prof. Anita Sharma', email: 'anita.sharmaFAC@oit.edu', desig: 'Associate Professor', qual: 'Ph.D. Computer Science' },
      { name: 'Prof. Vikram Singh', email: 'vikram.singhFAC@oit.edu', desig: 'Assistant Professor', qual: 'M.Tech CSE' },
      { name: 'Dr. Rajesh Gupta', email: 'rajesh.guptaFAC@oit.edu', desig: 'Professor', qual: 'Ph.D. AI & ML' },
      { name: 'Dr. Meera Nambiar', email: 'meera.nambiarFAC@oit.edu', desig: 'Assistant Professor', qual: 'Ph.D. Cybersecurity' },
      { name: 'Prof. Priya Patel', email: 'priya.patelFAC@oit.edu', desig: 'Associate Professor', qual: 'Ph.D. Software Engg' },
      { name: 'Dr. Amitava Roy', email: 'amitava.royFAC@oit.edu', desig: 'Professor', qual: 'Ph.D. Data Science' },
      { name: 'Dr. Sanjay Verma', email: 'sanjay.vermaFAC@oit.edu', desig: 'Assistant Professor', qual: 'M.Tech Computer Systems' },
      { name: 'Prof. Suresh Nair', email: 'suresh.nairFAC@oit.edu', desig: 'Professor', qual: 'Ph.D. Cloud Computing' },
      { name: 'Dr. Kavita Deshmukh', email: 'kavita.deshmukhFAC@oit.edu', desig: 'Associate Professor', qual: 'Ph.D. Algorithms' },
      { name: 'Prof. Alok Mishra', email: 'alok.mishraFAC@oit.edu', desig: 'Assistant Professor', qual: 'M.Tech Web Security' }
    ];

    const createdFaculty = [];
    for (let f of facultyList) {
      const u = await User.create({
        username: f.name,
        email: f.email,
        password: facultyPass,
        role: 'Faculty',
        status: 'active'
      });
      const profile = await Faculty.create({
        user_id: u.id,
        department_id: cseDept.department_id,
        designation: f.desig,
        qualification: f.qual,
        phone: '98765432' + String(createdFaculty.length).padStart(2, '0')
      });
      createdFaculty.push({ ...profile.toJSON(), user: u });
    }

    // 4. CSE COURSES
    const courses = await Course.bulkCreate([
      { department_id: cseDept.department_id, course_name: 'Data Structures & Algorithms', course_code: 'CS201', credits: 4 },
      { department_id: cseDept.department_id, course_name: 'Database Management Systems', course_code: 'CS301', credits: 4 },
      { department_id: cseDept.department_id, course_name: 'Operating Systems', course_code: 'CS302', credits: 3 },
      { department_id: cseDept.department_id, course_name: 'Web Technologies', course_code: 'CS401', credits: 3 }
    ]);

    // 5. COURSE OFFERINGS (Section A and Section B)
    const offerings = await CourseOffering.bulkCreate([
      { course_id: courses[0].course_id, faculty_id: createdFaculty[0].faculty_id, semester: 3, year: 2025, section: 'A' },
      { course_id: courses[0].course_id, faculty_id: createdFaculty[1].faculty_id, semester: 3, year: 2025, section: 'B' },
      { course_id: courses[1].course_id, faculty_id: createdFaculty[2].faculty_id, semester: 3, year: 2025, section: 'A' },
      { course_id: courses[1].course_id, faculty_id: createdFaculty[3].faculty_id, semester: 3, year: 2025, section: 'B' },
      { course_id: courses[2].course_id, faculty_id: createdFaculty[4].faculty_id, semester: 3, year: 2025, section: 'A' },
      { course_id: courses[2].course_id, faculty_id: createdFaculty[5].faculty_id, semester: 3, year: 2025, section: 'B' },
      { course_id: courses[3].course_id, faculty_id: createdFaculty[6].faculty_id, semester: 3, year: 2025, section: 'A' },
      { course_id: courses[3].course_id, faculty_id: createdFaculty[7].faculty_id, semester: 3, year: 2025, section: 'B' }
    ]);

    // 6. EXAMS
    const exams = await Exam.bulkCreate([
      { course_id: courses[0].course_id, exam_name: 'Mid-Term Examination', total_marks: 50, exam_date: '2025-09-15' },
      { course_id: courses[0].course_id, exam_name: 'End-Term Examination', total_marks: 100, exam_date: '2025-12-10' },
      { course_id: courses[1].course_id, exam_name: 'Mid-Term Examination', total_marks: 50, exam_date: '2025-09-16' },
      { course_id: courses[1].course_id, exam_name: 'End-Term Examination', total_marks: 100, exam_date: '2025-12-11' }
    ]);

    // Generate 100 unique student names & sort ALPHABETICALLY for each section!
    const allNames = [];
    for (let i = 0; i < 100; i++) {
      const fn = rawFirstNames[i % rawFirstNames.length];
      const ln = rawLastNames[i % rawLastNames.length];
      allNames.push(`${fn} ${ln}`);
    }

    // Split 50 for Sec A, 50 for Sec B, then sort each section alphabetically
    const secANames = allNames.slice(0, 50).sort((a, b) => a.localeCompare(b));
    const secBNames = allNames.slice(50, 100).sort((a, b) => a.localeCompare(b));

    const createdStudents = [];
    const enrollmentsToCreate = [];
    const feesToCreate = [];
    const hostelsToCreate = [];

    const sectionAOfferings = [offerings[0], offerings[2], offerings[4], offerings[6]];
    const sectionBOfferings = [offerings[1], offerings[3], offerings[5], offerings[7]];

    // Create Section A Students (Alphabetically ordered 1 to 50)
    for (let i = 0; i < secANames.length; i++) {
      const fullName = secANames[i];
      const parts = fullName.split(' ');
      const fn = parts[0].toLowerCase();
      const ln = parts[1].toLowerCase();
      const email = `${fn}.${ln}${i > 0 ? i : ''}@oit.edu`;
      const seq = i + 1;
      const rollNo = `OIT-2025-A-${String(seq).padStart(3, '0')}`;
      const regNo = `OIT-REG-2025-${String(seq).padStart(3, '0')}`;

      const u = await User.create({
        username: fullName,
        email,
        password: studentPass,
        role: 'Student',
        status: 'active'
      });

      const s = await Student.create({
        user_id: u.id,
        department_id: cseDept.department_id,
        roll_no: rollNo,
        registration_no: regNo,
        semester: 3,
        year: 2025,
        phone: `91234${String(10000 + seq).padStart(5, '0')}`,
        address: `OIT Campus Residency Block A, Room ${100 + seq}`,
        guardian_name: `Mr. ${parts[1]}`,
        guardian_phone: `98100${String(10000 + seq).padStart(5, '0')}`
      });

      createdStudents.push({ ...s.toJSON(), user: u, section: 'A', seq });

      sectionAOfferings.forEach(off => {
        enrollmentsToCreate.push({ student_id: s.student_id, offering_id: off.offering_id });
      });

      feesToCreate.push({
        student_id: s.student_id, semester: 3, academic_year: 2025,
        tuition_fee: 45000.00, exam_fee: 3000.00, hostel_fee: 12000.00, total_amount: 60000.00,
        paid_amount: seq % 4 !== 0 ? 60000 : 30000, due_amount: seq % 4 !== 0 ? 0 : 30000,
        status: seq % 4 !== 0 ? 'Paid' : 'Partial', due_date: '2025-10-31'
      });

      hostelsToCreate.push({
        student_id: s.student_id, hostel_name: 'OIT Aryabhata Hostel', block: 'Block A',
        room_no: `A-${100 + seq}`, warden_name: 'Dr. S. K. Nandi', warden_phone: '9876500112', status: 'Occupied'
      });
    }

    // Create Section B Students (Alphabetically ordered 1 to 50)
    for (let i = 0; i < secBNames.length; i++) {
      const fullName = secBNames[i];
      const parts = fullName.split(' ');
      const fn = parts[0].toLowerCase();
      const ln = parts[1].toLowerCase();
      const seq = i + 1;
      const totalIdx = 50 + seq;
      const email = `${fn}.${ln}${totalIdx}@oit.edu`;
      const rollNo = `OIT-2025-B-${String(seq).padStart(3, '0')}`;
      const regNo = `OIT-REG-2025-${String(totalIdx).padStart(3, '0')}`;

      const u = await User.create({
        username: fullName,
        email,
        password: studentPass,
        role: 'Student',
        status: 'active'
      });

      const s = await Student.create({
        user_id: u.id,
        department_id: cseDept.department_id,
        roll_no: rollNo,
        registration_no: regNo,
        semester: 3,
        year: 2025,
        phone: `91234${String(10000 + totalIdx).padStart(5, '0')}`,
        address: `OIT Campus Residency Block B, Room ${100 + seq}`,
        guardian_name: `Mr. ${parts[1]}`,
        guardian_phone: `98100${String(10000 + totalIdx).padStart(5, '0')}`
      });

      createdStudents.push({ ...s.toJSON(), user: u, section: 'B', seq });

      sectionBOfferings.forEach(off => {
        enrollmentsToCreate.push({ student_id: s.student_id, offering_id: off.offering_id });
      });

      feesToCreate.push({
        student_id: s.student_id, semester: 3, academic_year: 2025,
        tuition_fee: 45000.00, exam_fee: 3000.00, hostel_fee: 12000.00, total_amount: 60000.00,
        paid_amount: seq % 4 !== 0 ? 60000 : 0, due_amount: seq % 4 !== 0 ? 0 : 60000,
        status: seq % 4 !== 0 ? 'Paid' : 'Pending', due_date: '2025-10-31'
      });

      hostelsToCreate.push({
        student_id: s.student_id, hostel_name: 'OIT Sarojini Hostel', block: 'Block B',
        room_no: `B-${100 + seq}`, warden_name: 'Dr. Ritu Saxena', warden_phone: '9876500112', status: 'Occupied'
      });
    }

    await Enrollment.bulkCreate(enrollmentsToCreate);
    await Fee.bulkCreate(feesToCreate);
    await Hostel.bulkCreate(hostelsToCreate);

    // 8. ATTENDANCE & RESULTS
    const attendanceRecords = [];
    const resultsToCreate = [];
    const today = new Date();

    createdStudents.forEach((student, index) => {
      const isSecA = student.section === 'A';
      const offering = isSecA ? offerings[0] : offerings[1];

      for (let d = 1; d <= 5; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - d);
        const dateStr = date.toISOString().split('T')[0];
        const status = (index + d) % 8 === 0 ? 'Absent' : (index + d) % 13 === 0 ? 'Late' : 'Present';

        attendanceRecords.push({
          student_id: student.student_id,
          offering_id: offering.offering_id,
          date: dateStr,
          status
        });
      }

      const marks = 30 + ((index * 3) % 20);
      resultsToCreate.push({
        student_id: student.student_id,
        exam_id: exams[0].exam_id,
        marks,
        grade: marks >= 45 ? 'A' : marks >= 40 ? 'A-' : marks >= 35 ? 'B+' : 'B'
      });
    });

    await Attendance.bulkCreate(attendanceRecords);
    await Result.bulkCreate(resultsToCreate);

    // 9. BOOKS CATALOG
    const books = await Book.bulkCreate([
      { title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest', isbn: 'OIT-978-0262033848', category: 'Computer Science', total_copies: 20, available_copies: 18 }
    ]);
    await LibraryBorrow.bulkCreate([
      { student_id: createdStudents[0].student_id, book_id: books[0].book_id, issue_date: '2025-08-01', due_date: '2025-08-15', status: 'Issued' }
    ]);

    // 10. INVENTORY
    await Inventory.bulkCreate([
      { item_name: 'OIT High-Performance GPU Workstations', category: 'Lab Equipment', quantity: 30, unit_price: 120000.00, department_id: cseDept.department_id, status: 'In Stock' }
    ]);

    // 11. EVENTS
    await Event.bulkCreate([
      { title: 'OIT Annual AI & Robotics Hackathon 2025', description: '24-hour campus hackathon', event_type: 'Workshop', event_date: '2025-09-05', location: 'OIT Main Auditorium' }
    ]);

    // 12. MESSAGES
    await Message.create({
      sender_id: createdStudents[0].user.id,
      receiver_id: createdFaculty[0].user.id,
      subject: 'Question regarding Data Structures Assignment',
      content: 'Respected Prof. Anita Sharma, could you please clarify the deadline for Assignment 2?',
      is_read: false
    });

    console.log('✅ Generated OIT Alphabetical Section A & Section B Students (1 to 50)!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};

module.exports = seedDatabase;
