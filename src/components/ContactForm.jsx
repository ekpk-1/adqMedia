import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const form = useRef();
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await emailjs.sendForm(
        'service_0mq30n7',  // From Email.js dashboard
        'template_4pnytzh', // From Email.js dashboard
        form.current,
        'XhGpwfH0wJyP0eQBy'   // From Email.js dashboard
      );
      
      setStatus('success');
      e.target.reset();
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="w-[75%] mx-auto py-6 px-16 bg-zinc-900 rounded-lg shadow-lg col-span-1 xl:col-span-2 lg:col-span-2 max-sm:w-full max-sm:px-4 max-sm:py-4" id="contact-form" >
      <h2 className="text-2xl font-bold text-white mx-auto text-center mb-10 max-sm:my-6">Get In Touch</h2>
      
      <form ref={form} onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 lg:grid-cols-2 gap-4">
        <div className='max-sm:col-span-1'>
          <label htmlFor="user_name" className="block text-sm font-medium text-white">
            Name
          </label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black p-2 bg-zinc-300"
          />
        </div>

        <div className='max-sm:col-span-1'>
          <label htmlFor="user_email" className="block text-sm font-medium text-white">
            Email
          </label>
          <input
            type="email"
            id="user_email"
            name="user_email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black p-2 bg-zinc-300"
          />
        </div>

        <div className='col-span-2'>
          <label htmlFor="user_inquiry" className="block text-sm font-medium text-white">
            Inquiry
          </label>
          <input
            type="text"
            id="user_inquiry"
            name="user_inquiry"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black p-2 bg-zinc-300"
          />
        </div>
        

        <div className='col-span-2'>
          <label htmlFor="message" className="block text-sm font-medium text-white">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black p-2 bg-zinc-300 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-[50%] bg-red-400 text-white py-2 px-4 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors col-span-2 mx-auto"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>

        {status === 'success' && (
          <p className="text-green-600 text-center col-span-2">Message sent successfully!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 text-center col-span-2">Failed to send message. Please try again.</p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
