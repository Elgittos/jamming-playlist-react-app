import { redirectToSpotifyAuth, isAuthenticated, logout } from '../api';

function LoginButton() {
  const authenticated = isAuthenticated();

  const handleLogin = () => {
    redirectToSpotifyAuth();
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  if (authenticated) {
    return (
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
      >
        Logout
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors shadow-lg"
    >
      Login with Spotify
    </button>
  );
}

export default LoginButton;

