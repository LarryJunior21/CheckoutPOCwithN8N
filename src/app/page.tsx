'use client'

import { useEffect, useState, ChangeEvent, JSX } from 'react'
import ReactGA from 'react-ga4'

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
    <div style={{ marginBottom: 16 }}>
      <p>Step:{' '}{step === 'cart' ? '1/3 - Cart' : step === 'checkout' ? '2/3 - Checkout' : '3/3 - Confirmation'}</p>
    </div>
  )

  return (
    <main style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Commerce POC</h1>
      <StepIndicator />
      {step === 'cart' && (
        <section>
          <h2>Cart</h2>
          <p>{PRODUCT.name}</p>
          <p>¥{PRODUCT.price}</p>
          <button onClick={proceedToCheckout}>Continue to Checkout</button>
          <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>You're making progress! Step 1 of 3.</p>
        </section>
      )}
      {step === 'checkout' && (
        <section>
          <h2>Checkout</h2>
          <label>Postcode (JP)<input type='text' value={postcode} onChange={handlePostcodeChange} style={{ display: 'block', width: '100%', padding: 8 }} placeholder='7-digit postcode' /></label>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p style={{ fontSize: 12, color: '#555', marginTop: 4 }}>Enter a valid 7-digit Japanese postcode.</p>
          <button onClick={validateAndPay}>Pay ¥{PRODUCT.price}</button>
        </section>
      )}
      {step === 'confirmation' && (
        <section>
          <h2>Order Confirmed</h2>
          <p>Thank you for your purchase.</p>
          <p>Refresh the page to restart the flow.</p>
        </section>
      )}
    </main>
  )
}