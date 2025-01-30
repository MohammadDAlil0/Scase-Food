import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Ghost from './pages/Ghost';
import ProtectedRoute from './components/ProtectedRoute';
import Restaurants from './pages/Restaurants';
import CreateRestaurant from './pages/CreateRestaurant';
import UpdateRestaurant from './pages/UpdateRestaurant';
import Food from './pages/Food';
import CreateFood from './pages/CreateFood';
import UpdateFood from './pages/UpdateFood';
import Users from './pages/Users';
import MyOrders from './pages/MyOrders';
import OrdersOfMyContribution from './pages/OrdersOfMyContribution';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ghost" element={<Ghost />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} /> {/* Add this route */}
          <Route path="/restaurants" element={<Restaurants />} /> {/* Add this route */}
          <Route path="/restaurants/create" element={<CreateRestaurant />} />
          <Route path="/restaurants/update/:id" element={<UpdateRestaurant />} />
          <Route path="/food" element={<Food />} /> {/* Add this route */}
          <Route path="/food/create" element={<CreateFood />} /> {/* Add this route */}
          <Route path="/food/update/:id" element={<UpdateFood />} /> {/* Add this route */}
          <Route path="/ordersOfMyContribution" element={<OrdersOfMyContribution />} />
          <Route path="/myOrders" element={<MyOrders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;