import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-white px-6 text-center">
      <h2 className="text-6xl font-serif mb-4 text-[#C5A059]">404</h2>
      <p className="text-xl font-light text-white/60 mb-8">The estate you are looking for does not exist or has been moved.</p>
      <Link 
        href="/"
        className="px-10 py-4 bg-[#C5A059] text-black text-xs uppercase tracking-[0.3em] font-medium hover:bg-white transition-all duration-500"
      >
        Return Home
      </Link>
    </div>
  );
}
