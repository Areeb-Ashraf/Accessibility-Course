import "./styles/homepage.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="homepage-container">
      <main className="hero-section">
        <img src="/sitting-panda.svg" alt="sitting panda" />
        <div>
          <h1 className="hero-title">Learn Accessibility</h1>
          <p className="hero-description">
            Master the art of creating inclusive digital experiences that work for everyone. 
            This course will equip you with the knowledge and skills to make your web applications 
            accessible to users of all abilities.
          </p>
          <div className="cta-buttons">
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
            <Link href="/signup" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}