import { motion } from "framer-motion";
import {
  Activity,
  BookOpenCheck,
  CalendarCheck2,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import aboutImage from "../assets/about_image.png";
import "./ProjectPages.css";

const objectives = [
  { icon: HeartHandshake, title: "Make care easier to navigate", text: "Bring patient and doctor workflows together in a clear, approachable interface." },
  { icon: ShieldCheck, title: "Respect responsible data design", text: "Demonstrate authenticated experiences and transparent boundaries for unsupported features." },
  { icon: Activity, title: "Turn activity into insight", text: "Present appointment and practice information in useful, readable dashboards." },
];

const features = [
  "Role-aware patient and doctor workspaces",
  "Appointment discovery, booking, and status management",
  "Responsive dashboards, calendars, and analytics",
  "Profile, availability, and account settings",
  "Display-only payment and presentation data",
  "Accessible controls and clear empty states",
];

const About = () => (
  <main className="project-page">
    <section className="project-hero">
      <div>
        <span className="project-eyebrow"><Stethoscope size={15} /> ABOUT THE PROJECT</span>
        <h1>A thoughtful digital home for everyday care.</h1>
        <p>Unfazed Care is an educational Healthcare Management System created to explore how patients and healthcare professionals can connect through one simple, well-designed experience.</p>
        <span className="project-educational-chip"><BookOpenCheck size={14} /> College major project · Educational demonstration</span>
      </div>
      <img src={aboutImage} alt="Healthcare team supporting patients" />
    </section>

    <section className="project-intro-card">
      <div>
        <span className="project-section-kicker">OUR PROJECT</span>
        <h2>Inspired by the warmth of modern online care</h2>
      </div>
      <p>This independently designed project takes inspiration from the welcoming, easy-to-use patterns seen across modern online therapy and healthcare platforms. It uses its own product identity, copy, interface, and implementation. It is a learning project—not a medical provider or a replacement for professional care.</p>
    </section>

    <section className="project-objectives-section">
      <div className="project-heading">
        <span className="project-section-kicker">WHY WE BUILT IT</span>
        <h2>Project objectives</h2>
        <p>Explore the practical challenges of building a calm and connected healthcare experience.</p>
      </div>
      <div className="project-objectives-grid">
        {objectives.map(({ icon: Icon, title, text }) => (
          <motion.article className="project-objective-card" key={title} whileHover={{ y: -3 }}>
            <span><Icon size={20} /></span><h3>{title}</h3><p>{text}</p>
          </motion.article>
        ))}
      </div>
    </section>

    <section className="project-features-section">
      <div className="project-heading">
        <span className="project-section-kicker">WHAT YOU CAN EXPLORE</span>
        <h2>Platform features</h2>
      </div>
      <div className="project-feature-list">
        {features.map((feature) => <div key={feature}><CalendarCheck2 size={17} /><span>{feature}</span></div>)}
      </div>
    </section>

    <section className="project-stack-card">
      <span className="project-section-kicker">BUILT WITH</span>
      <h2>Technology stack</h2>
      <div className="project-stack-list">
        {["React", "Vite", "Tailwind CSS", "Lucide React", "Framer Motion", "Node.js API", "MongoDB"].map((item) => <span key={item}>{item}</span>)}
      </div>
      <p>Payment processing, medical record storage, and notification delivery are demo-only presentation surfaces unless explicitly connected to a service.</p>
    </section>
  </main>
);

export default About;
