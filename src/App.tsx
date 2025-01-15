import { ThemeProvider } from "./components/nav/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage } from "./components/main/MainPage";
import { Layout } from "./components/Layout/Layout";
import SignInPage from "./components/Registration/ProfileForm";
import RegistrationForm from "./components/Registration/Registration";
import AboutPage from "./components/About/About";
import AuthorPage from "./components/AuthorPage/SingleAuthor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { UseAuthContext } from "./components/context/hooks/AuthContextHook";
import { AuthGuard } from "./components/route-guards/AuthGuard";
// import Homeview from "./components/Profile/AvatarView";
import BlogView from "./components/Blogs/Blog";
import { ProfileView } from "./components/Profile/view/profile";
// import ProfilePage from "./components/Profile/ProfilePage";

const queryClient = new QueryClient();

function App() {
  const { handleSetUser } = UseAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSetUser(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSetUser(session);
    });

    return () => subscription.unsubscribe();
  }, [handleSetUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<MainPage />} />
              <Route
                path="sign-in"
                element={
                  <AuthGuard>
                    <SignInPage />
                  </AuthGuard>
                }
              ></Route>
              <Route
                path="about"
                element={
                  // <AuthGuard>
                  // </AuthGuard>
                  <AboutPage />
                }
              ></Route>
              <Route
                path="registration"
                element={
                  <AuthGuard>
                    <RegistrationForm />
                  </AuthGuard>
                }
              />
              <Route path="MainPage" element={<MainPage />}></Route>
              <Route path="BlogList" element={<BlogView />}></Route>
              <Route path="ProfileView" element={<ProfileView />} />

              <Route path="author/:authorId" element={<AuthorPage />}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
