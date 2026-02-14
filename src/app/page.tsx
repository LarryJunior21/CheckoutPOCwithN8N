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

  // =========================
  // Send dummy events to GA4 for dashboard data
  // =========================
  const sendDummyData = (): void => {
    // Cart view / add to cart
    ReactGA.event({
      category: 'cart',
      action: 'add_to_cart',
      label: PRODUCT.id,
      value: PRODUCT.price,
      nonInteraction: true
    })

    // Begin checkout
    ReactGA.event({
      category: 'checkout',
      action: 'begin_checkout',
      label: PRODUCT.id,
      nonInteraction: true
    })

    // Purchase
    ReactGA.event({
      category: 'checkout',
      action: 'purchase',
      label: PRODUCT.id,
      value: PRODUCT.price,
      nonInteraction: true
    })

    console.log('Dummy events sent to GA4!')
  }

  // =========================
  // On mount
  // =========================
  useEffect(() => {
    // Real user action
    ReactGA.event({
      category: 'cart',
      action: 'view_cart',
      label: PRODUCT.id
    })

    // Send batch dummy events for dashboard
    sendDummyData()
  }, [])

  // =========================
  // Flow actions
  // =========================
  const proceedToCheckout = (): void => {
    ReactGA.event({
      category: 'checkout',
      action: 'begin_checkout',
      label: PRODUCT.id
    })
    setStep('checkout')
  }

  const validateAndPay = (): void => {
    if (!/^\d{7}$/.test(postcode)) {
      setError('Invalid JP postcode')
      ReactGA.event({
        category: 'checkout',
        action: 'validation_error',
        label: 'postcode'
      })
      return
    }

    ReactGA.event({
      category: 'checkout',
      action: 'purchase',
      label: PRODUCT.id,
      value: PRODUCT.price
    })

    setStep('confirmation')
  }

  const handlePostcodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPostcode(e.target.value)
    if (error) setError(null)
  }

  // =========================
  // UI (unchanged)
  // =========================
  return (
    <main style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Commerce POC</h1>

      {step === 'cart' && (
        <section>
          <h2>Cart</h2>
          <p>{PRODUCT.name}</p>
          <p>¥{PRODUCT.price}</p>
          <button onClick={proceedToCheckout}>Checkout</button>
        </section>
      )}

      {step === 'checkout' && (
        <section>
          <h2>Checkout</h2>
          <label>
            Postcode (JP)
            <input
              type="text"
              value={postcode}
              onChange={handlePostcodeChange}
              style={{ display: 'block', width: '100%', padding: 8 }}
            />
          </label>
          {error && <p style={{ color: 'red' }}>{error}</p>}
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
