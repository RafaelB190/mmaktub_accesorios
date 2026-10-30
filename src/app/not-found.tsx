import Link from "next/link";

import { Logo } from "@/components/ui/Logo";
import { buttonStyles } from "@/components/ui/button-styles";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-6 py-16 text-center">
      <div>
        <Logo />
        <p className="mt-12 text-[10px] font-medium uppercase tracking-[0.3em] text-clay">
          Error 404
        </p>
        <h1 className="mt-4 text-balance text-5xl leading-[1] sm:text-6xl">
          Esta página no
          <span className="block italic text-clay">estaba escrita.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted">
          Puede que el link haya cambiado o que la pieza ya no esté disponible.
          Volvamos a un lugar conocido.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonStyles("primary", "lg")}>
            Ir al inicio
          </Link>
          <Link href="/productos" className={buttonStyles("outline", "lg")}>
            Ver productos
          </Link>
        </div>
      </div>
    </main>
  );
}
