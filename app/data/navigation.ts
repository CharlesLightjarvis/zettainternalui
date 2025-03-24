import {
  Users,
  Settings,
  BookOpen,
  Calendar,
  GraduationCap,
  ClipboardList,
  FileText,
  MessageSquare,
  Bell,
  UserCog,
  School,
  Library,
  PenTool,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

const adminNavItems: NavItem[] = [
  {
    title: "Users Management",
    url: "#",
    icon: Users,
    items: [
      { title: "All Users", url: "/admin/users" },
      { title: "Add User", url: "/admin/users/add" },
      { title: "Roles", url: "/admin/users/roles" },
    ],
  },
  {
    title: "Academic",
    url: "#",
    icon: School,
    items: [
      { title: "Departments", url: "/admin/academic/departments" },
      { title: "Programs", url: "/admin/academic/programs" },
      { title: "Courses", url: "/admin/academic/courses" },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      { title: "General", url: "/admin/settings/general" },
      { title: "Security", url: "/admin/settings/security" },
      { title: "Notifications", url: "/admin/settings/notifications" },
    ],
  },
];

const teacherNavItems: NavItem[] = [
  {
    title: "Courses",
    url: "#",
    icon: BookOpen,
    items: [
      { title: "My Courses", url: "/teacher/courses" },
      { title: "Create Course", url: "/teacher/courses/create" },
      { title: "Course Materials", url: "/teacher/courses/materials" },
    ],
  },
  {
    title: "Students",
    url: "#",
    icon: GraduationCap,
    items: [
      { title: "Class List", url: "/teacher/students" },
      { title: "Grades", url: "/teacher/students/grades" },
      { title: "Attendance", url: "/teacher/students/attendance" },
    ],
  },
  {
    title: "Assignments",
    url: "#",
    icon: ClipboardList,
    items: [
      { title: "Create Assignment", url: "/teacher/assignments/create" },
      { title: "Grade Assignments", url: "/teacher/assignments/grade" },
    ],
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
    items: [
      { title: "Schedule", url: "/teacher/calendar" },
      { title: "Events", url: "/teacher/calendar/events" },
    ],
  },
];

const studentNavItems: NavItem[] = [
  {
    title: "My Courses",
    url: "#",
    icon: BookOpen,
    items: [
      { title: "Enrolled Courses", url: "/student/courses" },
      { title: "Course Materials", url: "/student/courses/materials" },
    ],
  },
  {
    title: "Assignments",
    url: "#",
    icon: FileText,
    items: [
      { title: "Pending", url: "/student/assignments/pending" },
      { title: "Submitted", url: "/student/assignments/submitted" },
      { title: "Grades", url: "/student/assignments/grades" },
    ],
  },
  {
    title: "Library",
    url: "#",
    icon: Library,
    items: [
      { title: "Resources", url: "/student/library" },
      { title: "Downloads", url: "/student/library/downloads" },
    ],
  },
  {
    title: "Communication",
    url: "#",
    icon: MessageSquare,
    items: [
      { title: "Messages", url: "/student/communication/messages" },
      { title: "Announcements", url: "/student/communication/announcements" },
    ],
  },
];

export const getNavItemsByRole = (role: string | undefined): NavItem[] => {
  switch (role) {
    case "admin":
      return adminNavItems;
    case "teacher":
      return teacherNavItems;
    case "student":
      return studentNavItems;
    default:
      return [];
  }
};
