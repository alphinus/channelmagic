import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          ChannelMagic
        </div>
        <Link href="/onboarding">
          <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10">
            Loslegen
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Dein YouTube & TikTok Kanal
          <br />
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            in 6 einfachen Schritten
          </span>
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
          So einfach, dass es jeder kann. Der Magic Wizard begleitet dich von der Idee
          bis zum fertigen Video - alles automatisch mit KI.
        </p>

        <Link href="/onboarding">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6">
            Jetzt starten - Kostenlos
          </Button>
        </Link>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
          <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Thema eingeben</h3>
            <p className="text-zinc-400">
              Ein Satz reicht. Die KI macht den Rest - Keywords, Branding, alles automatisch.
            </p>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
            <div className="text-3xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold mb-2">Avatar wählen</h3>
            <p className="text-zinc-400">
              Wähle aus 100+ Avataren oder erstelle deinen eigenen. Er spricht deine Skripte.
            </p>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Veröffentlichen</h3>
            <p className="text-zinc-400">
              Mit einem Klick auf YouTube & TikTok. Thumbnail und Beschreibung inklusive.
            </p>
          </div>
        </div>

        {/* Magic Assistant Preview */}
        <div className="mt-24 bg-zinc-800/30 rounded-2xl p-8 border border-zinc-700 max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl">
              🤖
            </div>
            <div className="text-left">
              <p className="font-semibold mb-1">Magic Assistant</p>
              <p className="text-zinc-400">
                &quot;Hallo! Ich bin dein Magic Assistant. Ich helfe dir bei jedem Schritt -
                von der Themenwahl bis zum fertigen Video. Lass uns loslegen!&quot;
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-zinc-800 text-center text-zinc-500">
        <p>ChannelMagic - Powered by AI</p>
      </footer>
    </div>
  );
}
