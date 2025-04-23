import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";

const publicRoutes = [
    { path: "/", component: Home },
    { path: "/dashboard", component: Dashboard },
    { path: "/login", component: Login, layout: null },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
