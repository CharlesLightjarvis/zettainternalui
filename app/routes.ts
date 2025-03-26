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
    ...prefix("student/dashboard", [index("./routes/student/home.tsx")]),
    ...prefix("teacher/dashboard", [index("./routes/teacher/home.tsx")]),
    ...prefix("admin/dashboard", [index("./routes/admin/home.tsx")]),
  ]),
] satisfies RouteConfig;
