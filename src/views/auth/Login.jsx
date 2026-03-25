import React, { useState } from "react";
import "./Login.css";
import { useTranslation } from "react-i18next";
import axiosClient from "../../services/axiosClient";
import { useEffect } from "react";
import { useSystem } from "../../context/SystemContext";

const Login = () => {
  const { t, i18n, ready } = useTranslation();
  const { systemInfo } = useSystem();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Show loading if i18n not ready
  if (!ready) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('app_language', lang); // Save language preference
  };

  useEffect(() => {
    // Load Bootstrap CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.crossorigin = "anonymous";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css";
    document.head.appendChild(link);

    // Initialize language from localStorage
    const savedLang = localStorage.getItem('app_language') || 'en';
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }

    return () => {
      document.head.removeChild(link);
    };
  }, [i18n]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/api/login", {
        email,
        password,
      });

      const data = response.data;

      const token = data.token || data.access_token;
      if (token) {
        localStorage.setItem("app_auth_token", token);
      }

      if (data.user) {
        localStorage.setItem("app_auth_user", JSON.stringify(data.user));
      }

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        {/* Left Side */}
        <div className="login-left">
          <div className="language-selector">
            <label htmlFor="language">{t("auth.change_language")}</label>
            <select
              id="language"
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">{t("auth.english")}</option>
              <option value="kh">{t("auth.khmer")}</option>
            </select>
          </div>

          <center>
            <img
              src={systemInfo.logo_url}
              alt="App Logo"
              width="150px"
              height="130px"
              className="img-fluid"
            />
          </center>

          <div className="title">{t("auth.login")}</div>
          <br />
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="input-box">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder={t("auth.email")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-box">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder={t("auth.password")}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <center>
              <button
                type="submit"
                className="btn btn-primary"
                id="loginBtn"
                disabled={isLoading}
              >
                <span className="btn-text">
                  {isLoading ? t("auth.logging_in") : t("auth.login")}
                </span>

                {isLoading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
              </button>
            </center>
          </form>
        </div>
        {/* Right Side */}
        <div className="login-right">
          <h1>{t("auth.brand_text.title")}</h1>
          <p>{t("auth.brand_text.subtitle1")}</p>
          <p>{t("auth.brand_text.subtitle2")}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
