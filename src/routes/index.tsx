import { createFileRoute } from "@tanstack/react-router";
import heroImage from "../assets/iphone-15-hero.jpg";
import galaxyImage from "../assets/galaxy-s23.jpg";
import redmiImage from "../assets/redmi-note-13.jpg";
import accessoriesImage from "../assets/accessories-editorial.jpg";
import logoImage from "../assets/carvalhos-cell-logo.png";

const whatsappNumber = "5511999999999";

const products = [
  { brand: "Apple", name: "iPhone 15", detail: "128GB · Azul · Novo", price: "R$ 4.899", oldPrice: "R$ 5.299", tag: "Oferta", image: heroImage },
  { brand: "Samsung", name: "Galaxy S23", detail: "256GB · Preto · Seminovo", price: "R$ 2.199", oldPrice: "R$ 2.399", tag: "Reservado", image: galaxyImage },
  { brand: "Xiaomi", name: "Redmi Note 13", detail: "128GB · Cinza · Novo", price: "R$ 1.199", image: redmiImage },
  { brand: "Apple", name: "iPhone 13", detail: "128GB · Meia-noite · Seminovo", price: "R$ 2.799", image: heroImage },
  { brand: "Acessórios", name: "AirPods Pro 2", detail: "Branco · Novo", price: "R$ 1.199", oldPrice: "R$ 1.399", tag: "Oferta", image: accessoriesImage },
  { brand: "Acessórios", name: "Carregador 20W USB-C", detail: "Branco · Novo", price: "R$ 99", image: accessoriesImage },
];

function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Carvalho's Cell — Celulares e Acessórios" },
      { name: "description", content: "iPhones, smartphones e acessórios novos e seminovos, com garantia e atendimento pelo WhatsApp." },
      { property: "og:title", content: "Carvalho's Cell — Celulares e Acessórios" },
      { property: "og:description", content: "Tecnologia selecionada, com garantia e atendimento direto pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function HeaderLogo() {
  return <img src={logoImage} alt="Carvalho's Cell" width={1303} height={394} className="h-9 w-auto sm:h-10" />;
}

function Index() {
  return (
    <main className="mesh min-h-screen overflow-hidden bg-background font-body text-foreground antialiased">
      <header className="relative z-30 border-b border-border/60 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
          <a href="#inicio" className="flex shrink-0 items-center" aria-label="Carvalho's Cell — início">
            <HeaderLogo />
          </a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Navegação principal">
            <a className="nav-link" href="#colecao">Celulares</a>
            <a className="nav-link" href="#colecao">Acessórios</a>
            <a className="nav-link" href="#ofertas">Ofertas</a>
            <a className="nav-link" href="#contato">Contato</a>
          </nav>
          <a className="button-primary hidden sm:inline-flex" href={whatsappLink("Olá! Vim pelo site da Carvalho's Cell e gostaria de mais informações.")} target="_blank" rel="noreferrer">
            WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <section id="inicio" className="relative mx-auto max-w-7xl px-5 lg:px-10">
        <div className="grid items-center gap-14 py-14 lg:min-h-[760px] lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="relative z-10 lg:col-span-6">
            <p className="eyebrow"><span className="size-1.5 rounded-full bg-primary" />Vitrine de tecnologia</p>
            <h1 className="mt-7 max-w-[18ch] text-balance font-display text-4xl font-semibold leading-[1.04] sm:text-5xl lg:text-6xl">
              Celulares e acessórios tratados como joias.
            </h1>
            <p className="mt-6 max-w-[48ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Uma seleção de iPhone, Samsung e Xiaomi, com procedência, garantia e atendimento direto pelo WhatsApp.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a className="button-primary" href={whatsappLink("Olá! Quero saber mais sobre os aparelhos disponíveis.")} target="_blank" rel="noreferrer">Falar no WhatsApp <span aria-hidden="true">↗</span></a>
              <a className="button-secondary" href="#colecao">Ver a coleção <span aria-hidden="true">↓</span></a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-subtle">
              <span>iPhone</span><span>Samsung</span><span>Xiaomi</span><span>Acessórios</span>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="hero-frame overflow-hidden rounded-xl bg-card/60 p-3">
              <img src={heroImage} width={1200} height={1408} alt="iPhone em acabamento grafite com iluminação dourada" className="aspect-[4/5] w-full rounded-lg object-cover" />
            </div>
            <div className="gold-glow absolute -bottom-7 left-2 rounded-lg border border-primary/30 bg-card/95 px-5 py-4 backdrop-blur-xl sm:-left-7">
              <p className="text-xs uppercase text-primary">Destaque</p>
              <p className="mt-1 font-display font-semibold">iPhone 15 · 128GB</p>
              <p className="mt-1 text-sm text-muted-foreground"><span className="text-primary">R$ 4.899</span> <span className="ml-1 text-subtle line-through">R$ 5.299</span></p>
            </div>
          </div>
        </div>
      </section>

      <section id="colecao" className="mx-auto max-w-7xl px-5 py-20 lg:px-10 lg:py-28">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div><p className="section-label">Seleção curada</p><h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Peças em destaque</h2></div>
          <a href="#ofertas" className="nav-link hidden text-sm sm:inline-flex">Ver ofertas <span aria-hidden="true">→</span></a>
        </div>
        <div id="ofertas" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <article key={product.name} className="product-card group rounded-xl bg-card/70 p-4">
              <div className="relative overflow-hidden rounded-lg bg-background">
                {product.tag && <span className={product.tag === "Reservado" ? "tag tag-muted" : "tag"}>{product.tag}</span>}
                <img src={product.image} loading={index === 0 ? undefined : "lazy"} width={index === 0 ? 1200 : 1024} height={index === 0 ? 1408 : 1024} alt={`${product.name} — ${product.detail}`} className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]" />
              </div>
              <div className="px-1 pb-1 pt-5">
                <p className="section-label text-subtle">{product.brand}</p>
                <h3 className="mt-2 font-display text-lg font-medium">{product.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{product.detail}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-lg font-semibold text-primary">{product.price}</span>
                  {product.oldPrice && <span className="text-sm text-subtle line-through">{product.oldPrice}</span>}
                </div>
                <a className="product-action" href={whatsappLink(`Olá! Tenho interesse no ${product.name} (${product.detail}).`)} target="_blank" rel="noreferrer">Consultar disponibilidade <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-10">
        <div className="category-band rounded-xl bg-card/50 p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div><p className="section-label">Categorias</p><h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">Explore por linha</h2></div>
            <div className="flex flex-wrap gap-3">{["iPhone", "Samsung", "Motorola", "Xiaomi", "Acessórios"].map((category) => <a href="#colecao" className="category-pill" key={category}>{category}</a>)}</div>
          </div>
        </div>
      </section>

      <footer id="contato" className="mx-auto max-w-7xl px-5 pb-10 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3"><BrandMark small /><div><p className="font-display text-sm font-semibold">Carvalho's Cell</p><p className="text-xs text-subtle">Tecnologia com garantia e procedência.</p></div></div>
          <div className="flex items-center gap-5 text-sm"><a className="nav-link" href="https://instagram.com/carvalhoscell" target="_blank" rel="noreferrer">Instagram</a><a className="button-primary" href={whatsappLink("Olá! Vim pelo site da Carvalho's Cell.")} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a></div>
        </div>
      </footer>
    </main>
  );
}