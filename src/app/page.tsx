'use client'

import { useEffect, useState, ChangeEvent, JSX } from 'react'
import ReactGA from 'react-ga4'
import { motion } from 'framer-motion'

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

export default function CartCheckoutPage(): JSX.Element {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart')
  const [postcode, setPostcode] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const sendDummyData = (): void => {
    ReactGA.event({ category: 'cart', action: 'add_to_cart', label: PRODUCT.id, value: PRODUCT.price, nonInteraction: true })
    ReactGA.event({ category: 'checkout', action: 'begin_checkout', label: PRODUCT.id, nonInteraction: true })
    ReactGA.event({ category: 'checkout', action: 'purchase', label: PRODUCT.id, value: PRODUCT.price, nonInteraction: true })
    console.log('Dummy events sent to GA4!')
  }

  useEffect(() => {
    ReactGA.event({ category: 'cart', action: 'view_cart', label: PRODUCT.id })
    sendDummyData()
  }, [])

  const proceedToCheckout = (): void => {
    ReactGA.event({ category: 'checkout', action: 'begin_checkout', label: PRODUCT.id })
    setStep('checkout')
  }

  const validateAndPay = (): void => {
    if (!/^\\d{7}$/.test(postcode)) {
      setError('Invalid JP postcode')
      ReactGA.event({ category: 'checkout', action: 'validation_error', label: 'postcode' })
      return
    }
    ReactGA.event({ category: 'checkout', action: 'purchase', label: PRODUCT.id, value: PRODUCT.price })
    setStep('confirmation')
  }

  const handlePostcodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPostcode(e.target.value)
    if (error) setError(null)
  }

  const StepIndicator = (): JSX.Element => (
    <div style={{ marginBottom: 16, fontSize: 14, color: '#555' }}>
      Step: {step === 'cart' ? '1/3 - Cart' : step === 'checkout' ? '2/3 - Checkout' : '3/3 - Confirmation'}
    </div>
  )

  const AnimatedSection = ({ children }: { children: React.ReactNode }): JSX.Element => (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ marginBottom: 24 }}>
      {children}
    </motion.section>
  )

  return (
    <main style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Commerce POC</h1>
      <StepIndicator />

      {step === 'cart' && (
        <AnimatedSection>
          <h2>Cart</h2>
          <p>{PRODUCT.name}</p>
          <p>¥{PRODUCT.price}</p>
          <button style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'background-color 0.2s' }} onClick={proceedToCheckout} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#005bb5')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0070f3')}>Continue to Checkout</button>
          <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>You're making progress! Step 1 of 3.</p>
        </AnimatedSection>
      )}

      {step === 'checkout' && (
        <AnimatedSection>
          <h2>Checkout</h2>
          <label>
            Postcode (JP)
            <input type='text' value={postcode} onChange={handlePostcodeChange} style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} placeholder='7-digit postcode' />
          </label>
          {error && <p style={{ color: 'red', marginTop: 4 }}>{error}</p>}
          <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', marginTop: 12, transition: 'background-color 0.2s' }} onClick={validateAndPay} onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e7e34')} onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#28a745')}>Pay ¥{PRODUCT.price}</button>
        </AnimatedSection>
      )}

      {step === 'confirmation' && (
        <AnimatedSection>
          <h2>Order Confirmed</h2>
          <p>Thank you for your purchase.</p>
          <p>Refresh the page to restart the flow.</p>
        </AnimatedSection>
      )}
    </main>
  )
}