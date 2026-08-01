import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 min-w-0">
        {children}
      </main>
    </div>
  )
}
