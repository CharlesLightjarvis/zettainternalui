import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // login route
  index("routes/home.tsx"),

  route("login", "./routes/auth/login.tsx"),

  layout("./components/dashboard-layout.tsx", [
    // student routes
    ...prefix("student/dashboard", [index("./routes/student/home.tsx")]),

    // teacher routes
    ...prefix("teacher/dashboard", [index("./routes/teacher/home.tsx")]),

    // admin routes
    ...prefix("admin/dashboard", [
      index("./routes/admin/home.tsx"),
      route(
        "notifications",
        "./routes/admin/notifications/notification-page.tsx"
      ),
      route("users", "./routes/admin/users/users-list.tsx"),
      route("categories", "./routes/admin/categories/categories-list.tsx"),
      route("formations", "./routes/admin/formations/formations-list.tsx"),
      route(
        "certifications",
        "./routes/admin/certifications/certifications-list.tsx"
      ),
      route("sessions", "./routes/admin/sessions/sessions-list.tsx"),
      route("modules", "./routes/admin/modules/modules-list.tsx"),
      route("lessons", "./routes/admin/lessons/lessons-list.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
