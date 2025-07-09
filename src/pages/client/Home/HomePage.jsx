import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  const navigate = useNavigate(); // استفاده از useNavigate برای هدایت

  return (
    <div
      className={`${styles.container} ${
        theme === "dark" ? styles.darkTheme : ""
      }`}
    >
      {/* دکمه‌ها در گوشه راست بالا */}
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() => navigate("/auth")} // کلیک → هدایت به auth
        >
          ورود / ثبت نام
        </button>
        <button
          className={styles.button}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      {/* عکس و معرفی */}
      <div className={styles.main}>
        <img
          src="/my-img.png"
          alt="Profile"
          className={styles.profileImage}
        />
        <h1 className={styles.title}>سلام من مائده‌ام</h1>
        <p className={styles.subtitle}>
          عاشق ساختن تجربه‌های خوب توی وبم  
          اینجا جاییه که طراحی و کدنویسی به هم می‌رسن :)
        </p>
      </div>
    </div>
  );
};

export default HomePage;














