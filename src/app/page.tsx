import OnyxRegionalLogo from '../components/header';

export default function Home() {
  return (
    <main>
      <header>
            <OnyxRegionalLogo />
      </header>
      <section className="flex flex-col items-center justify-center min-h-screen bg-black-50 p-8 pb-10">
        <h1 className="text-2xl font-bold>">What is your query for NSW legislation?</h1>
        <input 
          type="text"
          placeholder='Type your query...'
          className='px-4 py-2 border border-gray-300 rounded-xl w-120 h-15 mt-6 text-lightgray-800'
        />
      </section>
    </main>
  );
}
