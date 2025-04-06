import { useEffect } from "react";

const TranslationWidget = () => {
  useEffect(() => {
    window.gtranslateSettings = {
      default_language: "en",
      native_language_names: true,
      languages: ["en", "mr"],
      wrapper_selector: ".gtranslate_wrapper",
      switcher_horizontal_position: "left",
      switcher_vertical_position: "bottom",
      float_switcher_open_direction: "top",
    };

    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); 
    };
  }, []);

  return <div className="gtranslate_wrapper"></div>;
};

export default TranslationWidget;