import { Outlet } from 'react-router-dom'
import { Layout as AntLayout } from 'antd'

const { Header, Content, Footer } = AntLayout

export default function Layout() {
  return (
    <AntLayout className="min-w-screen !min-h-screen">
      <Header className="bg-green-500 text-white flex items-center px-6">
        <h1 className="text-xl font-bold">LooqDex</h1>
      </Header>

      <Content className="px-4 sm:px-6 md:px-10 py-6 max-w-[1144px] mx-auto w-full flex flex-col">
        <Outlet />
      </Content>

      <Footer className="text-center">
        <p>© {new Date().getFullYear()} - Meu Projeto Pokémon</p>
      </Footer>
    </AntLayout>
  )
}
