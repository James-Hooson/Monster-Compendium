import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-black">
      <nav className="bg-black/60 backdrop-blur-md border-b-2 border-red-600/50 p-4">
        <div className="max-w-6xl mx-auto">
          <Link 
            to="/monsters" 
            className="bg-red-700 hover:bg-red-600 text-amber-100 font-bold py-2 px-6 rounded border-2 border-amber-600/50 transition-all duration-200 shadow-lg hover:shadow-amber-500/30 font-serif tracking-wide inline-block"
          >
            📜 Monster Compendium
          </Link>
        </div>
      </nav>
      
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-5xl font-bold text-center text-amber-400 mb-2 drop-shadow-2xl font-serif tracking-wider">
          Welcome to the potential adventures page, where we await the adventure awaiting us!
        </h1>
      </main>
    </div>
  )
}

export default Home