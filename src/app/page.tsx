'use client'

import { useEffect, useState, ChangeEvent, JSX } from 'react'
import ReactGA from 'react-ga4'
import { motion } from 'framer-motion'
import { FullStory, init } from '@fullstory/browser'

interface Product {
  id: string
  name: string
  price: number
}

const PRODUCT: Product = {
  id: 'sku-001',
  name: 'POC Sneakers',
  price: 120
};

// -----------------
// Helper components
// -----------------
const StepIndicator = ({ step }: { step: 'cart' | 'checkout' | 'confirmation' }): JSX.Element => (
  <div 
    className="step-indicator" 
    role="status" 
    aria-live="polite"
    aria-label={`Step ${step === 'cart' ? '1' : step === 'checkout' ? '2' : '3'}: ${step === 'cart' ? 'Cart' : step === 'checkout' ? 'Checkout' : 'Confirmation'}`}
  >
    Step: {step === 'cart' ? '1/3 - Cart' : step === 'checkout' ? '2/3 - Checkout' : '3/3 - Confirmation'}
  </div>
)

const AnimatedSection = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <motion.section 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.3 }} 
    className="animated-section"
  >
    {children}
  </motion.section>
)

const Button = ({ children, onClick, color }: { children: React.ReactNode, onClick: () => void, color: 'primary' | 'success' }): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className={`button button-${color}`}
      aria-label={typeof children === 'string' ? children : 'Button'}
    >
      {children}
    </button>
  )
}

// -----------------
// Main Page
// -----------------
export default function CartCheckoutPage(): JSX.Element {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [postcode, setPostcode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // ---- FullStory Init ----
  useEffect(() => {
    const orgId = process.env.NEXT_PUBLIC_FULLSTORY_ORGID
    if (!orgId) {
      console.warn('FullStory: NEXT_PUBLIC_FULLSTORY_ORGID is not set — skipping initialization.')
      return
    }
    init({ orgId })
    console.log('[v0] FullStory initialized with orgId:', orgId)
    FullStory('trackEvent', { name: 'page_view', properties: { page: window.location.pathname } })
  }, [])

  // ---- GA4 Init ----
  useEffect(() => {
    ReactGA.event({ category: 'cart', action: 'view_cart', label: PRODUCT.id })
  }, [])

  const proceedToCheckout = (): void => {
    ReactGA.event({ category: 'checkout', action: 'begin_checkout', label: PRODUCT.id })
    setStep('checkout')
  }

  const validateAndPay = (): void => {
    if (!/^\d{7}$/.test(postcode)) {
      setError('Invalid JP postcode (must be 7 digits)')
      ReactGA.event({ category: 'checkout', action: 'validation_error', label: 'postcode' })
      return
    }

    ReactGA.event({ category: 'checkout', action: 'purchase', label: PRODUCT.id, value: PRODUCT.price })

    // FullStory custom event
    FullStory('trackEvent', {
      name: 'purchase_completed',
      properties: { productId: PRODUCT.id, price: PRODUCT.price }
    })

    setStep('confirmation')
  }

  const handlePostcodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 7)
    setPostcode(value)
    if (error) setError(null)
  }

  return (
    <main className="main-container">
      <h1 className="page-title">Commerce POC</h1>
      <StepIndicator step={step} />

      {step === 'cart' && (
        <AnimatedSection>
          <h2 className="section-title">Your Cart</h2>
          <div className="product-card">
            <p>{PRODUCT.name}</p>
            <p className="product-price">¥{PRODUCT.price}</p>
          </div>
          <Button onClick={proceedToCheckout} color="primary">Continue to Checkout</Button>
        </AnimatedSection>
      )}

      {step === 'checkout' && (
        <AnimatedSection>
          <h2 className="section-title">Checkout</h2>
          <div className="form-group">
            <label htmlFor="postcode" className="form-label">Postcode (JP)</label>
            <input
              id="postcode"
              type='text'
              value={postcode}
              onChange={handlePostcodeChange}
              placeholder='7-digit postcode'
              className={`form-input ${error ? 'error' : ''}`}
              aria-invalid={!!error}
              aria-describedby={error ? 'postcode-error' : undefined}
            />
            {error && <p id="postcode-error" className="error-message" role="alert">{error}</p>}
          </div>
          <Button onClick={validateAndPay} color="success">Pay ¥{PRODUCT.price}</Button>
        </AnimatedSection>
      )}

      {step === 'confirmation' && (
        <AnimatedSection>
          <h2 className="section-title">Order Confirmed</h2>
          <p>Thank you for your purchase.</p>
          <p className="secondary-text">Refresh the page to restart the flow.</p>
        </AnimatedSection>
      )}

      <style jsx>{`
        .main-container {
          max-width: 480px;
          margin: 40px auto;
          font-family: system-ui, sans-serif;
          padding: 0 16px;
        }
        
        .page-title {
          font-size: 28px;
          margin-bottom: 16px;
        }
        
        .step-indicator {
          margin-bottom: 24px;
          font-size: 14px;
          color: #555;
          font-weight: 500;
        }
        
        .animated-section {
          margin-bottom: 32px;
        }
        
        .section-title {
          font-size: 22px;
          margin-bottom: 8px;
        }
        
        .product-card {
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .product-price {
          font-size: 16px;
          font-weight: 600;
        }
        
        .button {
          padding: 12px 24px;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 16px;
          transition: background-color 0.2s;
          width: 100%;
        }
        
        .button-primary {
          background-color: #0070f3;
        }
        
        .button-primary:hover {
          background-color: #005bb5;
        }
        
        .button-success {
          background-color: #28a745;
        }
        
        .button-success:hover {
          background-color: #1e7e34;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .form-input {
          display: block;
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border-radius: 6px;
          border: 1px solid #ccc;
          outline: none;
        }
        
        .form-input.error {
          border-color: red;
        }
        
        .error-message {
          color: red;
          font-size: 14px;
          margin-top: 4px;
        }
        
        .secondary-text {
          font-size: 14px;
          color: #555;
        }
      `}</style>
    </main>
  )
}