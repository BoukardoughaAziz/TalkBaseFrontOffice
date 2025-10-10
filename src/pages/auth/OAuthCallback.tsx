import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/stores/userSlice';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOAuthCallback = () => {
      // Check URL parameters for success/error
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const error = urlParams.get('error');

      if (success === 'true') {
        // OAuth was successful, cookies should be set automatically
        // Try to get user data from cookies
        const getUserFromCookies = () => {
          const cookies = document.cookie.split('; ').reduce((acc, current) => {
            const [key, value] = current.split('=');
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);

          const userJson = cookies['user'];
          const accessToken = cookies['accessToken'];

          if (userJson && accessToken) {
            try {
              const user = JSON.parse(decodeURIComponent(userJson));
              console.log('OAuth user from cookies:', user);
              
              // Update Redux state
              dispatch(loginSuccess({
                accessToken,
                refreshToken: cookies['refreshToken'] || '',
                user
              }));

              // Redirect to dashboard
              navigate('/AppDashboard');
            } catch (error) {
              console.error('Error parsing user from cookies:', error);
              navigate('/sign-in?error=auth_failed');
            }
          } else {
            console.error('No user data found in cookies after OAuth');
            navigate('/sign-in?error=no_user_data');
          }
        };

        // Small delay to ensure cookies are set
        setTimeout(getUserFromCookies, 100);
      } else if (error) {
        console.error('OAuth error:', error);
        navigate(`/sign-in?error=${error}`);
      } else {
        // No clear success/error, redirect to sign-in
        navigate('/sign-in');
      }
    };

    handleOAuthCallback();
  }, [navigate, dispatch]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Completing sign-in...</p>
      </div>
    </div>
  );
}