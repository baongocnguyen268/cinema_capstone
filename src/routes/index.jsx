import { Route } from "react-router-dom";
import HomeTemplate from "../pages/HomeTemplate";
import HomePage from "../pages/HomeTemplate/HomePage";
import AboutPage from "../pages/HomeTemplate/AboutPage";
import MovieListPage from "../pages/HomeTemplate/MovieListPage";
import MovieDetails from "../pages/HomeTemplate/MovieDetailsPage";
import NewsPage from "../pages/HomeTemplate/NewsPage";
import RegisterPage from "../pages/HomeTemplate/RegisterPage";
import BuyTicketPage from "../pages/HomeTemplate/BuyTicketPage";
import OnAir from "../pages/HomeTemplate/OnAirPage";
import ComingSoon from "../pages/HomeTemplate/ComingSoonPage";
import LoginPage from "../pages/HomeTemplate/LoginPage";
import AdminTemplate from "../pages/AdminTemplate";
import Dashboard from "../pages/AdminTemplate/DashBoard";
const routes = [
  {
    path: "",
    element: HomeTemplate,
    nested: [
      {
        path: "",
        element: HomePage,
      },
      {
        path: "about",
        element: AboutPage,
      },
      {
        path: "movie-list",
        element: MovieListPage,
      },
      {
        path: "movie-details/:movieId",
        element: MovieDetails,
      },
      {
        path: "news",
        element: NewsPage,
      },
      {
        path: "register",
        element: RegisterPage,
      },
      {
        path: "buy-tickets",
        element: BuyTicketPage,
      },
      {
        path: "coming-soon",
        element: ComingSoon,
      },
      {
        path: "on-air",
        element: OnAir,
      },
      {
        path: "login",
        element: LoginPage,
      },
    ],
  },
  {
    path: "admin",
    element: AdminTemplate,
    nested: [
      {
        path: "dashboard",
        element: Dashboard,
      },
    ],
  },
];

export const generateRoutes = () => {
  return routes.map((routes) => {
    if (routes.nested) {
      return (
        <Route
          key={routes.path}
          path={routes.path}
          element={<routes.element />}
        >
          {routes.nested.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<item.element />}
            />
          ))}
        </Route>
      );
    } else {
      return (
        <Route
          key={routes.path}
          path={routes.path}
          element={<routes.element />}
        />
      );
    }
  });
};
