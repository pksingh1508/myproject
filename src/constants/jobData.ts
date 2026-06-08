export type JobRole = {
  title: string;
  salaryRange: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
};

export const jobData: JobRole[] = [
  {
    title: "Frontend Developer",
    salaryRange: "10 - 20 LPA",
    description:
      "We are looking for a Frontend Developer to build modern, responsive, and user-friendly web applications. You will work closely with designers and backend developers to create seamless digital experiences.",
    responsibilities: [
      "Develop responsive web applications using React, Next.js, Angular, or Vue.js.",
      "Convert UI/UX designs into functional interfaces.",
      "Optimize applications for speed and scalability.",
      "Ensure cross-browser and cross-device compatibility.",
      "Collaborate with backend teams to integrate APIs.",
      "Write clean, maintainable, and reusable code.",
    ],
    requiredSkills: [
      "HTML, CSS, JavaScript, TypeScript",
      "React.js, Next.js, Angular, or Vue.js",
      "REST APIs",
      "Git and GitHub",
      "Responsive Design",
    ],
  },
  {
    title: "Backend Developer",
    salaryRange: "10 - 20 LPA",
    description:
      "We are seeking a Backend Developer to design, develop, and maintain scalable server-side applications and APIs that power our products and services.",
    responsibilities: [
      "Develop and maintain RESTful APIs.",
      "Design and optimize databases.",
      "Implement authentication and authorization systems.",
      "Integrate third-party services and payment gateways.",
      "Ensure application security and performance.",
      "Troubleshoot and resolve backend issues.",
    ],
    requiredSkills: [
      "Node.js, Laravel, Django, Spring Boot, or Express.js",
      "SQL and NoSQL Databases",
      "API Development",
      "Authentication Systems",
      "Git",
    ],
  },
  {
    title: "Full Stack Developer",
    salaryRange: "10 - 20 LPA",
    description:
      "We are looking for a Full Stack Developer who can work across both frontend and backend technologies to build complete web applications from concept to deployment.",
    responsibilities: [
      "Develop frontend interfaces and backend APIs.",
      "Design and manage databases.",
      "Implement authentication and security features.",
      "Deploy and maintain applications.",
      "Collaborate with product and design teams.",
      "Optimize application performance.",
    ],
    requiredSkills: [
      "React, Next.js, Vue.js, or Angular",
      "Node.js, Laravel, Django, or Spring Boot",
      "SQL/NoSQL Databases",
      "Git and CI/CD",
      "Cloud Platforms",
    ],
  },
  {
    title: "Mobile App Developer",
    salaryRange: "10 - 20 LPA",
    description:
      "We are hiring a Mobile App Developer to create high-quality Android and iOS applications with a strong focus on performance, usability, and user experience.",
    responsibilities: [
      "Develop mobile applications for Android and iOS.",
      "Integrate APIs and backend services.",
      "Implement app security and authentication.",
      "Optimize app performance and responsiveness.",
      "Publish and maintain applications on app stores.",
      "Debug and fix application issues.",
    ],
    requiredSkills: [
      "React Native, Flutter, Kotlin, Swift, or Java",
      "Mobile UI Development",
      "REST APIs",
      "Firebase or Supabase",
      "App Store & Play Store Deployment",
    ],
  },
  {
    title: "React Developer",
    salaryRange: "10 - 20 LPA",
    description:
      "We are looking for a React Developer to build modern, scalable, and high-performance web applications using React and related technologies.",
    responsibilities: [
      "Develop reusable React components.",
      "Build responsive and interactive user interfaces.",
      "Integrate APIs and manage application state.",
      "Optimize application performance.",
      "Collaborate with designers and backend developers.",
      "Maintain code quality and documentation.",
    ],
    requiredSkills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Redux, Zustand, or Context API",
      "REST APIs",
    ],
  },
  {
    title: "React Native Developer",
    salaryRange: "10 - 20 LPA",
    description:
      "We are seeking a React Native Developer to build and maintain cross-platform mobile applications for Android and iOS.",
    responsibilities: [
      "Develop mobile applications using React Native and Expo.",
      "Implement authentication, notifications, and API integrations.",
      "Optimize application performance.",
      "Troubleshoot and fix bugs.",
      "Collaborate with designers and backend teams.",
      "Publish applications to app stores.",
    ],
    requiredSkills: [
      "React Native",
      "Expo",
      "JavaScript or TypeScript",
      "Firebase or Supabase",
      "Mobile App Deployment",
    ],
  },
  {
    title: "Node.js Developer",
    salaryRange: "10 - 20 LPA",
    description:
      "We are looking for a Node.js Developer to build scalable backend services and APIs that support modern web and mobile applications.",
    responsibilities: [
      "Design and develop RESTful APIs.",
      "Manage databases and server infrastructure.",
      "Implement authentication and authorization.",
      "Integrate third-party services and payment gateways.",
      "Optimize application performance.",
      "Write secure and maintainable code.",
    ],
    requiredSkills: [
      "Node.js",
      "Express.js or NestJS",
      "MongoDB, PostgreSQL, or MySQL",
      "JWT Authentication",
      "API Development",
    ],
  },
  {
    title: "Laravel Developer",
    salaryRange: "10 - 20 LPA",
    description:
      "We are seeking a Laravel Developer to build robust web applications, admin panels, APIs, and business management systems.",
    responsibilities: [
      "Develop web applications using Laravel.",
      "Create REST APIs and backend services.",
      "Design and manage database structures.",
      "Implement authentication and role-based access control.",
      "Integrate third-party APIs and payment gateways.",
      "Maintain application performance and security.",
    ],
    requiredSkills: [
      "PHP",
      "Laravel",
      "MySQL or PostgreSQL",
      "REST API Development",
      "Git and Version Control",
    ],
  },
];
