import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-6 border-t border-gray-800 text-center text-sm">
      <p>© 2025 ProShowz. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="#" className="hover:text-pink-500">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-pink-500">
          Terms of Service
        </a>
        <a href="#" className="hover:text-pink-500">
          Contact Us
        </a>
      </div>
    </footer>
  );
}
