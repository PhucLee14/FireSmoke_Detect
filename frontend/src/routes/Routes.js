import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";

const publicRoutes = [{ path: "/login", component: Login, layout: null }];
const privateRoutes = [
    { path: "/", component: Home },
    { path: "/dashboard", component: Dashboard },
];
export { publicRoutes, privateRoutes };
