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
}

// -----------------
// Helper components
// -----------------
const StepIndicator = ({ step }: { step: 'cart' | 'checkout' | 'confirmation' }): JSX.Element => (
  <div style={{ marginBottom: 24, fontSize: 14, color: '#555', fontWeight: 500 }}>
    Step: {step === 'cart' ? '1/3 - Cart' : step === 'checkout' ? '2/3 - Checkout' : '3/3 - Confirmation'}
  </div>
)

const AnimatedSection = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ marginBottom: 32 }}>
    {children}
  </motion.section>
)

const Button = ({ children, onClick, color }: { children: React.ReactNode, onClick: () => void, color: 'primary' | 'success' }): JSX.Element => {
  const styles = {
    primary: { backgroundColor: '#0070f3', hover: '#005bb5' },
    success: { backgroundColor: '#28a745', hover: '#1e7e34' }
  }
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 24px',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        backgroundColor: styles[color].backgroundColor,
        fontWeight: 500,
        fontSize: 16,
        transition: 'background-color 0.2s',
        width: '100%'
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = styles[color].hover)}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = styles[color].backgroundColor)}
    >
      {children}
    </button>
  )
}

// -----------------
// Main Page
// -----------------
export default function CartCheckoutPage(): JSX.Element {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart')
  const [postcode, setPostcode] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

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
    <main style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'system-ui, sans-serif', padding: '0 16px' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Commerce POC</h1>
      <StepIndicator step={step} />

      {step === 'cart' && (
        <AnimatedSection>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Your Cart</h2>
          <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 16 }}>
            <p style={{ fontSize: 16 }}>{PRODUCT.name}</p>
            <p style={{ fontSize: 16, fontWeight: 600 }}>¥{PRODUCT.price}</p>
          </div>
          <Button onClick={proceedToCheckout} color="primary">Continue to Checkout</Button>
        </AnimatedSection>
      )}

      {step === 'checkout' && (
        <AnimatedSection>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Checkout</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Postcode (JP)</label>
            <input
              type='text'
              value={postcode}
              onChange={handlePostcodeChange}
              placeholder='7-digit postcode'
              style={{
                display: 'block',
                width: '100%',
                padding: 12,
                fontSize: 16,
                borderRadius: 6,
                border: error ? '1px solid red' : '1px solid #ccc',
                outline: 'none'
              }}
            />
            {error && <p style={{ color: 'red', fontSize: 14, marginTop: 4 }}>{error}</p>}
          </div>
          <Button onClick={validateAndPay} color="success">Pay ¥{PRODUCT.price}</Button>
        </AnimatedSection>
      )}

      {step === 'confirmation' && (
        <AnimatedSection>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Order Confirmed</h2>
          <p style={{ fontSize: 16, marginBottom: 8 }}>Thank you for your purchase.</p>
          <p style={{ fontSize: 14, color: '#555' }}>Refresh the page to restart the flow.</p>
        </AnimatedSection>
      )}
    </main>
  )
}
