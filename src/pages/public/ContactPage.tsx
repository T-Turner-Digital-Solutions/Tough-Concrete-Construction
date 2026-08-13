import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { HeroLogoWatermark } from '@/components/marketing/HeroLogoWatermark';
import { BRAND } from '@/config/brand';

const SOCIAL_LABELS: Record<keyof typeof BRAND.social, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  google: 'Google Business Profile',
  youtube: 'YouTube',
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  function handleChange(field: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Demo only — no backend wired up yet. In production this would POST to a
    // `contact_messages` table (or trigger an admin notification) via Supabase.
    setSubmitted(true);
  }

  const socialEntries = (Object.keys(SOCIAL_LABELS) as (keyof typeof BRAND.social)[]).filter((k) => BRAND.social[k]);

  return (
    <div>
      <section className="relative overflow-hidden bg-concrete-950 bg-concrete-texture">
        <HeroLogoWatermark />
        <div className="container-page relative py-20 sm:py-28">
          <span className="inline-block rounded-full border border-safety-500/40 bg-safety-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-safety-400">
            Contact Us
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            Talk to a real person about your project.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-concrete-300">
            Call, email, or send a message below — we typically respond within one business day.
          </p>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-concrete-900">Get In Touch</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-concrete-500">Phone</dt>
                  <dd>
                    <a href={`tel:${BRAND.phone}`} className="font-semibold text-steel-700 hover:text-steel-800">
                      {BRAND.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-concrete-500">Email</dt>
                  <dd>
                    <a href={`mailto:${BRAND.email}`} className="font-semibold text-steel-700 hover:text-steel-800">
                      {BRAND.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-concrete-500">Office</dt>
                  <dd className="text-concrete-700">
                    {BRAND.address.street}
                    <br />
                    {BRAND.address.city}, {BRAND.address.state} {BRAND.address.zip}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-concrete-500">License</dt>
                  <dd className="text-concrete-700">
                    {BRAND.license.number} ({BRAND.license.state})
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-concrete-900">Business Hours</h2>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  {BRAND.hours.map((h) => (
                    <tr key={h.day} className="border-t border-concrete-100 first:border-t-0">
                      <td className="py-2 font-semibold text-concrete-700">{h.day}</td>
                      <td className="py-2 text-right text-concrete-500">{h.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-concrete-900">Service Area</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {BRAND.serviceAreas.map((a) => (
                  <span key={a.name} className="rounded-full border border-concrete-200 bg-concrete-50 px-3 py-1 text-xs font-semibold text-concrete-700">
                    {a.name}, {a.state}
                  </span>
                ))}
              </div>
            </div>

            {socialEntries.length > 0 && (
              <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-concrete-900">Follow Us</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {socialEntries.map((k) => (
                    <li key={k}>
                      <a
                        href={BRAND.social[k]}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-steel-700 hover:text-steel-800"
                      >
                        {SOCIAL_LABELS[k]} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-xl border border-concrete-200 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide text-concrete-900">Send a Message</h2>

              {submitted ? (
                <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <p className="font-display text-lg font-bold uppercase tracking-wide text-emerald-800">Message Sent</p>
                  <p className="mt-2 text-sm text-emerald-700">
                    Thanks, {form.name.split(' ')[0] || 'there'} — we&apos;ve got your message and will get back to you
                    within one business day. For anything urgent, call us at {BRAND.phoneDisplay}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-concrete-700">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      required
                      value={form.name}
                      onChange={handleChange('name')}
                      className="mt-1.5 w-full rounded-md border border-concrete-300 px-3 py-2 text-sm focus:border-steel-500 focus:outline-none focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="contact-phone" className="block text-sm font-semibold text-concrete-700">
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      className="mt-1.5 w-full rounded-md border border-concrete-300 px-3 py-2 text-sm focus:border-steel-500 focus:outline-none focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-concrete-700">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange('email')}
                      className="mt-1.5 w-full rounded-md border border-concrete-300 px-3 py-2 text-sm focus:border-steel-500 focus:outline-none focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="contact-subject" className="block text-sm font-semibold text-concrete-700">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      required
                      value={form.subject}
                      onChange={handleChange('subject')}
                      placeholder="e.g. Driveway estimate, question about a project"
                      className="mt-1.5 w-full rounded-md border border-concrete-300 px-3 py-2 text-sm focus:border-steel-500 focus:outline-none focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-concrete-700">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange('message')}
                      className="mt-1.5 w-full rounded-md border border-concrete-300 px-3 py-2 text-sm focus:border-steel-500 focus:outline-none focus:ring-1 focus:ring-steel-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" size="lg" fullWidth>
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
