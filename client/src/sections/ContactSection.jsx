import ConsultationForm from '../components/ConsultationForm';


export const ContactSection = () => {


  return (
    <section id="contact" className="bg-white py-24 border-b border-[#E2E8F0] text-[#101946]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column Contact Information Cards */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Let's grow{' '}
                <span className="text-[#101946] bg-[#B8FF00] px-3 py-0.5 rounded-xl inline-block border border-[#B8FF00]">
                  your
                </span>{' '}
                <span>business.</span>
              </h2>

              <p className="text-base text-[#64748B] leading-relaxed mt-4">
                Tell us a little about your business and we'll come back with a free strategy call and fixed quote within 24 hours.
              </p>
            </div>
          </div>

          {/* Right Column Consultation Form */}
          <div className="lg:col-span-7">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
