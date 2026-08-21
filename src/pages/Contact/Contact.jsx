import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiMessageCircle,
  FiCheckCircle,
} from "react-icons/fi";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-market-leaf via-market-leaf-dark to-emerald-950 px-4 py-16 text-white md:px-8 md:py-24 shadow-2xl">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-market-lime/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-market-sun/20 blur-3xl" />

        <div className="page-container relative z-10 flex flex-col items-center justify-between gap-10 py-0 lg:flex-row">
          <div className="max-w-xl text-center lg:text-left space-y-4 animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-market-lime/30 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="text-xs font-bold tracking-[0.2em] text-market-lime uppercase">
                Get In Touch
              </span>
            </div>

            <h1 className="font-display text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              We'd Love To <br />
              <span className="bg-gradient-to-r from-market-lime to-white bg-clip-text text-transparent">
                Hear From You.
              </span>
            </h1>

            <p className="text-base leading-relaxed text-white/85 sm:text-lg">
              Have questions about an order, want to partner as a grower, or need produce suggestions? Our support team is ready to assist you.
            </p>
          </div>

          <div className="grid h-36 w-36 place-items-center rounded-3xl bg-white/10 text-8xl shadow-2xl backdrop-blur-md animate-float lg:h-48 lg:w-48">
            💬
          </div>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="page-container">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Area: Direct Contact Channels */}
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-2">
              <span className="section-label">Reach Out</span>
              <h2 className="font-display text-3xl font-black text-slate-800 dark:text-white">
                Contact Information
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Connect directly through our support desk or visit our local distribution center.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <FiMail />,
                  title: "Email Support",
                  value: "support@freshmart.com",
                  desc: "We reply within 2 hours",
                },
                {
                  icon: <FiPhone />,
                  title: "Helpline",
                  value: "+91 98765 43210",
                  desc: "Mon - Sat: 8:00 AM - 8:00 PM",
                },
                {
                  icon: <FiMapPin />,
                  title: "Store & Hub",
                  value: "FreshMart Organic Hub, Green Park",
                  desc: "New Delhi, India",
                },
                {
                  icon: <FiClock />,
                  title: "Operating Hours",
                  value: "6:00 AM - 10:00 PM",
                  desc: "Dispatch 7 days a week",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="card flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-market-leaf/30 hover:shadow-lg dark:hover:shadow-market-leaf/10"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-market-lime/60 text-xl text-market-leaf dark:bg-market-leaf/30 dark:text-market-lime">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400">{item.title}</span>
                    <h3 className="font-display text-base font-bold text-slate-800 dark:text-white">
                      {item.value}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Area: Interactive Contact Form */}
          <div className="card p-8 lg:col-span-7 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-market-leaf text-white text-xl shadow-md">
                <FiMessageCircle />
              </div>
              <div>
                <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
                  Send us a Message
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fill out the form below and our team will get back to you promptly.
                </p>
              </div>
            </div>

            {submitted && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300 animate-rise">
                <FiCheckCircle className="text-2xl shrink-0" />
                <div>
                  <strong className="block text-sm font-bold">Message sent successfully!</strong>
                  <span className="text-xs">Thanks for reaching out. We will get back to you shortly.</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Your Full Name
                </label>
                <div className="input-field">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="input-field">
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <div className="input-field">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Message / Inquiry
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm outline-none transition-all focus:border-market-leaf focus:bg-white focus:ring-2 focus:ring-market-leaf/20 focus:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:focus:border-market-leaf-light"
                  placeholder="How can we help you? Describe your question or order feedback..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-base font-bold shadow-lg shadow-market-leaf/30 hover:shadow-xl hover:shadow-market-leaf/40 active:scale-95"
              >
                <FiSend />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
