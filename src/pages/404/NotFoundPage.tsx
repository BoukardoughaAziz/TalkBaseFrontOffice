import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("NotFoundPage mounted");
  }, []);

return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 text-center">
      <img
        src="https://img.icons8.com/ios-filled/100/ff4b4b/error--v1.png"
        alt="Error icon"
        className="mb-6 w-24 h-24"
      />
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</h2>
      <p className="text-gray-500 mt-4 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Home
      </a>
    </div>
  );
}