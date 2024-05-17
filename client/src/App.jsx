import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import { Denied } from './Pages/Denied';
import NotFound from './Pages/NotFound';
import Profile from './Pages/User/Profile';
import EditProfile from './Pages/User/EditProfile';
import ChangePassword from './Pages/Password/ChangePassword';
import RequireAuth from './Components/Auth/RequireAuth';
import NotRequireAuth from './Components/Auth/NotRequireAuth';
import ProductDetails from './Pages/Product/ProductDetails';
import CartDetails from './Pages/Cart/CartDetails';
import Order from './Pages/Order/Order';
import OrderSuccess from './Pages/Order/OrderSuccess';
import ViewOrder from './Pages/Order/ViewOrder';
import DashBoard from './Pages/Admin/DashBoard';
import AddProduct from './Pages/Admin/AddProduct';
import EditProduct from './Pages/Admin/EditProduct';
import UpdateOrder from './Pages/Admin/UpdateOrder';
import EditUser from './Pages/Admin/EditUser';
import ForgetPassword from './Pages/ForgetPassword';
import ResetPassword from './Pages/Password/ResetPassword';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/denied" element={<Denied />} />
        <Route path="/" element={<Home />} />

        {/* signUp, login, product details  */}
        <Route element={<NotRequireAuth />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
        <Route path="/product/:productId" element={<ProductDetails />} />
        {/* user data */}
        <Route element={<RequireAuth allowedRoles={['USER', 'ADMIN']} />}>
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/editprofile" element={<EditProfile />} />
          <Route path="/auth/change-password" element={<ChangePassword />} />
          <Route path="/product/cart" element={<CartDetails />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/product/my-order" element={<ViewOrder />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<DashBoard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/update-order/:id" element={<UpdateOrder />} />
          <Route path="/admin/edit-user/:id" element={<EditUser />} />
        </Route>

        {/* page not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
