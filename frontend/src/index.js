import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from './context/AuthContext';
import TranslationWidget from "./components/TranslationWidget";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
  <AuthProvider>
    <App />
    <Toaster/>
  </AuthProvider>
  <TranslationWidget />
  </BrowserRouter>
    

);
