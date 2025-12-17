import React, { useState } from 'react';
import apiService from '../services/apiService';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      await apiService.subscribeNewsletter({
        email,
        firstName,
        lastName,
        interests: ['general-news']
      });

      setMessage('Successfully subscribed to newsletter!');
      setEmail('');
      setFirstName('');
      setLastName('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to subscribe. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Subscribing...
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane"></i>
              Subscribe
            </>
          )}
        </button>
      </div>
      
      {/* Optional fields for better subscription */}
      <div className="optional-fields" style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="First Name (optional)"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isSubmitting}
          style={{ flex: '1', minWidth: '200px', padding: '8px 12px', border: 'none', borderRadius: '6px' }}
        />
        <input
          type="text"
          placeholder="Last Name (optional)"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isSubmitting}
          style={{ flex: '1', minWidth: '200px', padding: '8px 12px', border: 'none', borderRadius: '6px' }}
        />
      </div>

      {message && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '6px',
            backgroundColor: isError ? '#fee2e2' : '#dcfce7',
            color: isError ? '#dc2626' : '#16a34a',
            textAlign: 'center'
          }}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default NewsletterForm;