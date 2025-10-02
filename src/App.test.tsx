import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('should render the loading fallback', () => {
    render(<App />)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })
})
