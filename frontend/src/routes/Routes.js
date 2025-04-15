import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";

const publicRoutes = [
    { path: "/", component: Home },
    { path: "/dashboard", component: Dashboard },
];
const privateRoutes = [];
export { publicRoutes, privateRoutes };
