import React, { useState, useEffect } from 'react';
import pizzaLogo from '../assets/images/pizzaLogo.png';
import Footer from '../Components/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Redux/AuthSlice';
import { scrollToSection } from '../Helper/smoothScroll';
import { getCartDetails } from '../Redux/CartSlice';

export const Layout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartsData } = useSelector((state) => state?.cart);

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role);

  // handle logout
  const handleLogout = async (event) => {
    event.preventDefault();

    // calling the logout action
    const res = await dispatch(logout());

    // redirect to home once logout
    if (res?.payload?.success) {
      navigate('/');
    }
  };

  useEffect(() => {
    (async () => {
      // TODO: login with different user and check
      if (role == 'USER') {
        await dispatch(getCartDetails());
      }
    })();
  }, []);

  return (
    <div>
      {/* nav bar */}
      <nav className="flex items-center justify-around h-16 text-[#6B7280]  font-mono shadow-md border-none">
        <div className="flex items-center justify-center">
          <Link to={'/'}> Pizza APP</Link>
          <img src={pizzaLogo} alt="Pizza Logo" />
        </div>

        {/* center nav items  */}
        <div className="hidden md:block">
          {location.pathname === '/' && (
            <ul className="flex gap-4">
              <li className="hover:text-[#FF9110]">
                {' '}
                <Link to="#" onClick={() => scrollToSection('menu-section')}>
                  {' '}
                  Menu{' '}
                </Link>{' '}
              </li>
              <li className="hover:text-[#FF9110]">
                <Link
                  to="#"
                  onClick={() => scrollToSection('services-section')}
                >
                  {' '}
                  Services{' '}
                </Link>
              </li>
              <li className="hover:text-[#FF9110]">
                <Link to="#" onClick={() => scrollToSection('about-section')}>
                  {' '}
                  About{' '}
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/*  */}
        <div>
          <ul className="flex gap-4">
            <li className="hover:text-[#FF9110]">
              {!isLoggedIn && <Link to={'/signup'}> Signup </Link>}
            </li>
            <li className="hover:text-[#FF9110]">
              {/* if user logged in show logout vice versa */}
              {isLoggedIn ? (
                <Link onClick={handleLogout}> Logout </Link>
              ) : (
                <Link to={'/login'}> Login </Link>
              )}
            </li>

            {isLoggedIn && (
              <li className="hover:text-[#FF9110]">
                {/* TODO: check the path */}
                <Link to={'/user/profile'}> Profile </Link>
              </li>
            )}

            <div className="relative ">
              <Link to={'/product/cart'}>
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 25 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="24"
                    height="24"
                    transform="translate(0.578369)"
                    fill="white"
                  />
                  <path
                    d="M16.3284 10.5V6C16.3284 3.92893 14.6494 2.25 12.5784 2.25C10.5073 2.25 8.82837 3.92893 8.82837 6V10.5M20.1844 8.50723L21.4475 20.5072C21.5175 21.1715 20.9966 21.75 20.3287 21.75H4.828C4.16009 21.75 3.63926 21.1715 3.70918 20.5072L4.97234 8.50723C5.03261 7.93466 5.51543 7.5 6.09116 7.5H19.0656C19.6413 7.5 20.1241 7.93466 20.1844 8.50723ZM9.20337 10.5C9.20337 10.7071 9.03547 10.875 8.82837 10.875C8.62126 10.875 8.45337 10.7071 8.45337 10.5C8.45337 10.2929 8.62126 10.125 8.82837 10.125C9.03547 10.125 9.20337 10.2929 9.20337 10.5ZM16.7034 10.5C16.7034 10.7071 16.5355 10.875 16.3284 10.875C16.1213 10.875 15.9534 10.7071 15.9534 10.5C15.9534 10.2929 16.1213 10.125 16.3284 10.125C16.5355 10.125 16.7034 10.2929 16.7034 10.5Z"
                    stroke="#FF9110"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{' '}
                <span className="absolute  text-[10px] -top-1 -right-2 bg-yellow-600 rounded-full text-white py-[1px] px-[5px]">
                  {cartsData?.quantity ? cartsData?.quantity : 0}
                </span>
              </Link>
            </div>
          </ul>
        </div>
      </nav>
      {children}

      {/* footer */}
      <Footer />
    </div>
  );
};
