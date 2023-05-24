import viteLogo from "/vite.svg";
import "./App.css";

import { GoogleLogin } from "@react-oauth/google";
import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";

function App() {
  const [user, setUser] = useState();
  const [profile, setProfile] = useState();
  const [accessValidCloudflareContinue, setAccessValidCloudflareContinue] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error)
  });

  useEffect(() => {
    validateCloudflareCookieIfExists()
    if (accessContinue && user) {
      getGoogleProfileUserInfo();
    }
  }, [user]);

  const getGoogleProfileUserInfo = () => {
    axios
        .get(
          `${import.meta.env.VITE_URL_GOOGLE_API}=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          if (!res.data.email.includes(`${import.meta.env.VITE_DOMAIN_ATLAS}`)) {
            alert(`${import.meta.env.VITE_MSG_TEST}`);
          }
        })
        .catch((err) => console.log(err));
  }

  const validateCloudflareCookieIfExists = async () => {

    const cookie = await Cookies.get(`${import.meta.env.VITE_COOKIE_NAME}`);
    if(!cookie){
     const respu = await axios
        .get(
          `${import.meta.env.VITE_URL_CLOUDFLARE}`,
          {
            headers: {
              Accept: "application/json",
              cookie: `${import.meta.env.VITE_COOKIE_NAME}=${import.meta.env.VITE_AUTH_TEST}`,
            },
          }
        );

        respu.then((res) => {
          console.log(res)
          setAccessValidCloudflareContinue(true);
        })
        .catch((err) => console.log(err));//TODO Bloqueamos el acceso
        
    }
    
  }

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };
  //console.log(profile);

  return (
    <>
      <div className="d-flex flex-column flex-root" style={{backgroundImage: "url(src/assets/media/image.jpg)",backgroundSize:"cover",position:"fixed", overflow:"auto", width:"100%", height:"100%"}}>
			<div className="d-flex flex-column flex-center flex-column-fluid">
		
				<div className="d-flex flex-column flex-center text-center p-10">
			
					<div className="card card-flush w-md-650px py-5">
						<div className="card-body py-15 py-lg-20">
		
							<div className="mb-7">
								<a href="/" className="">
									<img alt="Logo" src="https://www.aseo.com.uy/assets/images/logo.svg" className="h-40px" />
								</a>
							</div>

			
							<h1 className="fw-bolder text-gray-900 mb-5">Intranet</h1>

		
							<div className="mb-0">
								<button onClick={() => login()} className="btn btn-lg btn-success fs-2">Iniciar sesión</button>
							</div>

						</div>
					</div>
	
				</div>

			</div>
			
		</div>


        {profile ? (
                      <div>
                        <img src={profile.picture} alt="user image" />
                        <h3>User Logged in</h3>
                        <p>Nombre: {profile.name}</p>
                        <p>Email Address: {profile.email}</p>
                        <br />
                        <button onClick={logOut}>Log out</button>
                        <p>
                          <strong>DATOS PERFIL</strong>:
                          {JSON.stringify(profile)}
                        </p>
                        <p>
                          <strong>DATOS USUARIO</strong>:{JSON.stringify(user)}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => login()}
                        className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100"
                        style={{ borderColor: "#000", display:"none" }}
                      >
                        <img
                          alt="Logo"
                          src="src/assets/media/svg/brand-logos/google-icon.svg"
                          className="h-15px me-3"
                        />
                        Ingresar con Google
                      </button>
                    )}
    </>
  );
}

export default App;
