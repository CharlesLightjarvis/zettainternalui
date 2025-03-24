import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/dashboard-layout.tsx", [
    index("routes/home.tsx"),

    ...prefix("playground", [route("settings", "./routes/settings.tsx")]),
    // route("playground/cards", "./components/section-cards.tsx"),
  ]),
] satisfies RouteConfig;
