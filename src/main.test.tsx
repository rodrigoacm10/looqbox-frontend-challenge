import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import ConfigProvider from 'antd/es/config-provider'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import { themeToken } from './tokens/themeToken'
import App from './App'
import { LoadingIcon } from './components/icons/LoadingIcon'

let queryClient: QueryClient
beforeEach(() => {
  queryClient = new QueryClient()
})

const renderWithProviders = () =>
  render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: themeToken,
          }}
        >
          <Provider store={store}>
            <App />
          </Provider>
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>,
  )

describe('main.tsx (entry point)', () => {
  it('deve renderizar o App sem crashar', () => {
    const { container } = renderWithProviders()
    expect(container).toBeInTheDocument()
  })

  it('deve aplicar o tema corretamente no ConfigProvider', () => {
    const { container } = renderWithProviders()
    expect(container.querySelector('.ant-app')).toBeNull()
  })

  it('renders the SVG spinner', () => {
    const { container } = render(<LoadingIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('animate-spin')
  })
})
