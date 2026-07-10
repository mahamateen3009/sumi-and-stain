import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';

// Import your local asset
import contactBanner from '../assets/contact-us-banner.avif';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  _gotcha: z.string().max(0, 'Bot detected').optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const TEXT = '#1A2A3A';
const MUTED = 'rgba(26, 42, 58, 0.62)';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [rateLimited, setRateLimited] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    if (rateLimited) return;
    setRateLimited(true);

    // Formspree ID: mykqadgq
    const FORMSPREE_ID = "mykqadgq";

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setStatus('error');
    }

    setTimeout(() => setRateLimited(false), 3000);
  };

  const inputCls = 'w-full rounded-xl px-4 py-3 text-sm border border-black/5';
  const inputStyle = { backgroundColor: '#F0F0DF', color: TEXT };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pb-20">

      {/* Banner using local asset */}
      <PageBanner imageUrl={contactBanner} />

      <div className="container mx-auto px-4 md:px-8 mt-12 flex items-center justify-center">
        <div
          className="max-w-2xl w-full p-8 md:p-12 rounded-3xl relative overflow-hidden"
          style={{
            background: '#D0C39F',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.30)',
            boxShadow: '0 4px 16px rgba(26,42,58,0.10), 0 16px 48px rgba(26,42,58,0.14)',
          }}
        >
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 text-glow" style={{ color: TEXT }}>
                Let's Connect
              </h1>
              <p className="text-sm font-medium" style={{ color: MUTED }}>
                Inquiries, commissions, or just saying hi.
              </p>
            </div>

            {status === 'success' ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                  style={{ background: 'rgba(227,99,151,0.20)', color: '#E36397' }}>
                  <CheckCircle2 size={30} />
                </div>
                <h2 className="text-2xl font-serif font-bold" style={{ color: TEXT }}>Message Sent!</h2>
                <p className="font-medium" style={{ color: MUTED }}>Thanks! I'll be in touch soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <input type="text" {...register('_gotcha')} className="hidden" tabIndex={-1} style={{ display: 'none' }} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: TEXT }}>Name</label>
                    <input {...register('name')} className={inputCls} style={inputStyle} placeholder="Your name" />
                    {errors.name && <p className="text-red-700 text-xs mt-1 font-medium">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: TEXT }}>Email</label>
                    <input type="email" {...register('email')} className={inputCls} style={inputStyle} placeholder="your@email.com" />
                    {errors.email && <p className="text-red-700 text-xs mt-1 font-medium">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: TEXT }}>Subject (Optional)</label>
                  <input {...register('subject')} className={inputCls} style={inputStyle} placeholder="What's this about?" />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: TEXT }}>Message</label>
                  <textarea {...register('message')} rows={5} className={`${inputCls} resize-none`} style={inputStyle}
                    placeholder="Your message here…" />
                  {errors.message && <p className="text-red-700 text-xs mt-1 font-medium">{errors.message.message}</p>}
                </div>

                {status === 'error' && (
                  <div className="p-3 rounded-xl text-xs font-medium"
                    style={{ background: 'rgba(180,60,60,0.08)', border: '1px solid rgba(180,60,60,0.25)', color: '#7a2020' }}>
                    Submission failed. Please try again later.
                  </div>
                )}

                <button type="submit" disabled={isSubmitting || rateLimited}
                  className="mx-auto  px-12 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: '#AF8A69', color: '#FFFFFF' }}>
                  {isSubmitting ? "Sending..." : (
                    <><Mail size={16} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}