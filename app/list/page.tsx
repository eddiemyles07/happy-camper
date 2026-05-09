'use client';

import { useState } from 'react';

export default function ListYourLand() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    propertyLocation: '',
    acres: '',
    description: '',
    hearAbout: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Styles />
        <Nav />
        <div className="success-page">
          <div className="success-card">
            <div className="success-icon">⛺</div>
            <h1>Thanks for your interest!</h1>
            <p>We&apos;ve got your info and will be in touch within 24 hours to talk through next steps. In the meantime, feel free to reach out directly.</p>
            <a href="/" className="back-link">← Back to Happy Camper</a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Styles />
      <Nav />
      <div className="list-hero">
        <div className="hero-tag">🌾 For landowners</div>
        <h1>Turn your land into <em>extra income</em>.</h1>
        <p>Got a quiet corner of land? List it on Happy Camper and we&apos;ll handle the bookings, payments, and guest communication. You set the price. You set the rules.</p>
      </div>

      <div className="benefits">
        <div className="benefit">
          <div className="benefit-icon">💰</div>
          <h3>Set your own price</h3>
          <p>You decide what your land is worth per night. Most hosts earn $400-$2,000/month.</p>
        </div>
        <div className="benefit">
          <div className="benefit-icon">🛡️</div>
          <h3>$1M liability coverage</h3>
          <p>Every booking comes with host protection. You&apos;re covered.</p>
        </div>
        <div className="benefit">
          <div className="benefit-icon">📅</div>
          <h3>Block dates anytime</h3>
          <p>Camp it yourself, host family, or take time off. Total control over your calendar.</p>
        </div>
      </div>

      <form className="list-form" onSubmit={handleSubmit}>
        <h2>Tell us about your land</h2>
        <p className="form-sub">Takes 2 minutes. We&apos;ll reach out personally within a day.</p>

        <div className="row">
          <div className="field">
            <label>Your name *</label>
            <input name="name" required value={form.name} onChange={handleChange} placeholder="Jane Smith" />
          </div>
          <div className="field">
            <label>Phone *</label>
            <input name="phone" required value={form.phone} onChange={handleChange} placeholder="(978) 555-1234" />
          </div>
        </div>

        <div className="field">
          <label>Email *</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="jane@example.com" />
        </div>

        <div className="row">
          <div className="field">
            <label>Property location *</label>
            <input name="propertyLocation" required value={form.propertyLocation} onChange={handleChange} placeholder="Concord, MA" />
          </div>
          <div className="field">
            <label>Approximate acreage</label>
            <input name="acres" value={form.acres} onChange={handleChange} placeholder="3 acres" />
          </div>
        </div>

        <div className="field">
          <label>Tell us about your property *</label>
          <textarea name="description" required value={form.description} onChange={handleChange} rows={4} placeholder="Open field with creek access, mostly wooded, etc. Anything that makes your land special." />
        </div>

        <div className="field">
          <label>How did you hear about us?</label>
          <select name="hearAbout" value={form.hearAbout} onChange={handleChange}>
            <option value="">Select one...</option>
            <option value="In person">Someone visited me in person</option>
            <option value="Friend">A friend</option>
            <option value="Facebook">Facebook</option>
            <option value="Google">Google search</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        <button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? 'Sending...' : 'Get started →'}
        </button>

        <p className="fine-print">No commitment. We&apos;ll review your property and reach out to discuss whether it&apos;s a fit.</p>
      </form>
    </>
  );
}

function Nav() {
  return (
    <nav>
      <a href="/" className="logo">
        <span>⛺</span>
        <span><span className="happy">Happy</span> Camper</span>
      </a>
      <div className="nav-links">
        <a href="/" className="nav-link">Explore</a>
        <button className="nav-btn">Sign in</button>
      </div>
    </nav>
  );
}

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --forest: #2D4A2D; --cream: #F5F0E8; --cream-dark: #EDE6D6;
        --bark-light: #C4A882; --ember: #C4622D;
        --text: #1C2B1C; --text-muted: #5A6B5A;
      }
      body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text); }
      a { color: inherit; text-decoration: none; }
      nav { background: var(--forest); padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 60px; position: sticky; top: 0; z-index: 100; }
      .logo { font-family: 'Fraunces', serif; font-size: 22px; color: var(--cream); display: flex; align-items: center; gap: 8px; cursor: pointer; }
      .logo .happy { font-style: italic; color: var(--bark-light); }
      .nav-links { display: flex; gap: 1.5rem; align-items: center; }
      .nav-link { color: var(--cream); opacity: 0.75; font-size: 14px; cursor: pointer; }
      .nav-btn { background: var(--ember); color: white; border: none; padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; }
      .list-hero { background: var(--forest); padding: 3.5rem 2rem 4rem; text-align: center; }
      .hero-tag { display: inline-block; background: rgba(196,168,130,0.2); color: var(--bark-light); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 1rem; }
      .list-hero h1 { font-family: 'Fraunces', serif; font-size: clamp(2rem, 5vw, 3.2rem); color: var(--cream); font-weight: 300; line-height: 1.15; margin-bottom: 0.75rem; }
      .list-hero h1 em { font-style: italic; color: var(--bark-light); }
      .list-hero p { color: rgba(245,240,232,0.75); font-size: 16px; max-width: 560px; margin: 0 auto; line-height: 1.6; }
      .benefits { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; max-width: 900px; margin: -2rem auto 0; padding: 0 2rem 2rem; position: relative; z-index: 2; }
      .benefit { background: white; border-radius: 16px; padding: 1.5rem; text-align: center; box-shadow: 0 4px 16px rgba(44,74,44,0.08); }
      .benefit-icon { font-size: 32px; margin-bottom: 0.5rem; }
      .benefit h3 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 400; margin-bottom: 0.5rem; }
      .benefit p { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
      .list-form { background: white; max-width: 600px; margin: 0 auto 4rem; padding: 2.5rem; border-radius: 20px; box-shadow: 0 4px 20px rgba(44,74,44,0.08); }
      .list-form h2 { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 400; margin-bottom: 0.4rem; }
      .form-sub { color: var(--text-muted); font-size: 14px; margin-bottom: 1.75rem; }
      .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .field { margin-bottom: 1rem; }
      .field label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 6px; font-weight: 500; }
      .field input, .field textarea, .field select { width: 100%; border: 1.5px solid var(--cream-dark); border-radius: 10px; padding: 11px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: var(--text); outline: none; background: white; }
      .field input:focus, .field textarea:focus, .field select:focus { border-color: var(--forest); }
      .field textarea { resize: vertical; }
      .submit-btn { width: 100%; background: var(--forest); color: white; border: none; padding: 15px; border-radius: 12px; font-size: 15px; font-weight: 500; cursor: pointer; margin-top: 0.5rem; font-family: 'DM Sans', sans-serif; }
      .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      .fine-print { font-size: 12px; color: var(--text-muted); text-align: center; margin-top: 1rem; }
      .error { background: #FEE; color: #C44; padding: 12px; border-radius: 10px; font-size: 13px; margin-bottom: 1rem; }
      .success-page { min-height: calc(100vh - 60px); display: flex; align-items: center; justify-content: center; padding: 2rem; }
      .success-card { background: white; max-width: 480px; padding: 3rem 2.5rem; border-radius: 20px; text-align: center; box-shadow: 0 4px 20px rgba(44,74,44,0.08); }
      .success-icon { font-size: 56px; margin-bottom: 1rem; }
      .success-card h1 { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 400; margin-bottom: 0.75rem; }
      .success-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem; }
      .back-link { color: var(--forest); font-size: 14px; font-weight: 500; }
      @media (max-width: 600px) { .row { grid-template-columns: 1fr; } .list-form { padding: 1.5rem; } }
    `}</style>
  );
}