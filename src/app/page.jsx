import OnyxRegionalLogo from '../components/header';
import MainUserTextbox from '../components/main_user_textbox';

export default function Home() {
  return (
    <main>
      <header>
        <OnyxRegionalLogo />
      </header>
      <section className="flex flex-col items-center justify-center min-h-screen bg-black-50 p-8 pb-10">
        <h1 className="text-2xl font-bold">What is your query for NSW legislation?</h1>
        <MainUserTextbox />
      </section>
    </main>
  );
}
