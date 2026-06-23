import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Diamond } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 800));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    reset();
  };

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-forest-950 py-24 text-center text-white overflow-hidden border-b border-forest-900">
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#b4f05b] mb-4">
              <Diamond size={8} className="fill-lime-500 text-lime-500" /> Support
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
            Get in Touch
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Have a question or want to partner with us? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Form and info content */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-forest-950">Contact Information</h2>
            <p className="text-forest-800/70 text-sm sm:text-base leading-relaxed">
              Whether you're a student with questions, a company looking to partner, or a university wanting to list your students — reach out to us.
            </p>
            
            <div className="mt-8 space-y-4 pt-6 border-t ">
              {[
                { icon: Mail,   label: 'Email Address',    value: 'hello@internbeacon.cm' },
                { icon: Phone,  label: 'Phone Contact',    value: '+237 699 000 000' },
                { icon: MapPin, label: 'Headquarters', value: 'Yaoundé, Cameroon' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-900 flex items-center justify-center shadow-sm">
                    <item.icon size={18} className="text-lime-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-forest-800/40">{item.label}</p>
                    <p className="font-extrabold text-forest-950 text-sm sm:text-base mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#f2f1ea] border border-[#e7e4d5] rounded-3xl p-8 space-y-4">
            
            <h3 className="text-lg font-black text-forest-950 mb-4 pb-2 border-b ">Send a message</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="Brian" error={errors.firstName?.message}
                {...register('firstName', { required: 'Required' })} />
              <Input label="Last Name" placeholder="Tabi" error={errors.lastName?.message}
                {...register('lastName', { required: 'Required' })} />
            </div>
            
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message}
              {...register('email', { required: 'Required' })} />
            
            <Input label="Subject" placeholder="Partnership inquiry" error={errors.subject?.message}
              {...register('subject', { required: 'Required' })} />
            
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900/60 mb-1">Message</label>
              <textarea rows={4} placeholder="Tell us how we can help…"
                className="w-full rounded-lg border  px-4 py-3 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20 bg-white resize-none"
                {...register('message', { required: 'Required' })} />
              {errors.message && <p className="text-xs text-red-650">{errors.message.message}</p>}
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-forest-950 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-forest-900 transition-all flex items-center justify-center gap-2 shadow-sm">
                <Send size={15} /> {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
