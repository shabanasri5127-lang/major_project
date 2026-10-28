import { useState } from "react";
import { Clock3, Mail, MapPin, Phone, Send, Stethoscope } from "lucide-react";
import "./ProjectPages.css";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="project-page contact-page">
      <header className="project-heading contact-heading">
        <span className="project-section-kicker">CONTACT THE PROJECT TEAM</span>
        <h1>We’re here to help you get in touch.</h1>
        <p>Questions about the project or a demonstration? Send us a note or use the sample contact details below.</p>
      </header>

      <div className="contact-layout">
        <section className="contact-information">
          <div className="contact-information-heading">
            <span className="contact-brand-icon"><Stethoscope size={19} /></span>
            <span><strong>Unfazed Care</strong><small>Healthcare Management System · Student project</small></span>
          </div>
          <div className="contact-detail"><span><Phone size={17} /></span><div><small>PHONE · DEMO PLACEHOLDER</small><a href="tel:+910000000000">+91 00000 00000</a></div></div>
          <div className="contact-detail"><span><Mail size={17} /></span><div><small>EMAIL · PROJECT CONTACT</small><a href="mailto:project.support@example.com">project.support@example.com</a></div></div>
          <div className="contact-detail"><span><Clock3 size={17} /></span><div><small>OFFICE HOURS · SAMPLE</small><strong>Monday – Friday · 9:00 AM – 5:00 PM IST</strong></div></div>
          <div className="contact-detail"><span><MapPin size={17} /></span><div><small>LOCATION · MAP PREVIEW</small><strong>Academic project team · India</strong></div></div>
          <div className="contact-map-placeholder" aria-label="Map placeholder">
            <span className="contact-map-grid" />
            <span className="contact-map-marker"><MapPin size={20} /></span>
            <span className="contact-map-caption">Map preview · no location service connected</span>
          </div>
        </section>

        <section className="contact-form-card">
          <span className="project-section-kicker">SEND AN ENQUIRY</span>
          <h2>How can we help?</h2>
          <p>Share a question or feedback about the educational project.</p>
          {submitted ? (
            <div className="contact-demo-notice" role="status">
              <span><Send size={17} /></span>
              <strong>Enquiry form preview submitted</strong>
              <p>This demonstration form does not send or store messages. Please use the project email listed here if you need to contact the team.</p>
              <button type="button" onClick={() => setSubmitted(false)}>Send another message</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>Name<input name="name" autoComplete="name" placeholder="Your name" required /></label>
              <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
              <label>What is this about?
                <select name="subject" defaultValue="project">
                  <option value="project">Project information</option>
                  <option value="demo">Demo or presentation</option>
                  <option value="feedback">Feedback</option>
                </select>
              </label>
              <label>Message<textarea name="message" rows="4" placeholder="Write your message..." required /></label>
              <button type="submit"><Send size={15} /> Preview enquiry</button>
              <small>Demo only · this form does not transmit or persist your message.</small>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};

export default Contact;
