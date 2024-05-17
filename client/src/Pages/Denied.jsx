import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Denied() {
  const navigate = useNavigate();

  return (
    <>
      <main className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
        <h1 className="font-extrabold tracking-widest text-white text-9xl">
          403
        </h1>
        <div className="absolute px-2 text-sm text-white bg-black rounded rotate-12">
          Access Denied
        </div>
        <button className="mt-5">
          <a className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-yellow-500 focus:outline-none focus:ring">
            <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0" />

            <span
              onClick={() => navigate(-1)}
              className="relative block px-8 py-3 bg-[#1A2238] border border-current"
            >
              Go Back
            </span>
          </a>
        </button>
      </main>
    </>
  );
}
