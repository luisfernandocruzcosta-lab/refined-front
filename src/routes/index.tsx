import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, Instagram, Menu, X, Plus, Smartphone } from "lucide-react";
import heroImage from "../assets/iphone-15-hero.webp";
import { fetchProducts, formatPrice, type Product } from "@/lib/products";
import { INSTAGRAM_URL, SHOP_CATEGORIES, filterCatalog } from "@/lib/catalog";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Drummondshop — Smartphones e acessórios" },
    { name: "description", content: "Encontre seu próximo smartphone na Drummondshop. Os melhores modelos, acessórios e tecnologia em um só lugar. Atendimento pelo Instagram @drummondshop." },
    { property: "og:title", content: "Drummondshop — Tecnologia que eleva sua experiência" },
    { property: "og:description", content: "Smartphones e acessórios. Explore o catálogo e fale com a Drummondshop pelo Instagram." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function InstagramLink({ children, quiet = false, className = "" }: { children: ReactNode; quiet?: boolean; className?: string }) {
  return <Button asChild variant={quiet ? "quiet" : "premium"} className={className}><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">{children}</a></Button>;
}

function Index() {
  const products = useQuery({ queryKey: ["products"], queryFn: fetchProducts });
  const [category, setCategory] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const visible = filterCatalog(products.data ?? [], category);
  function choose(value: string) {
    setCategory(value);
    setMenuOpen(false);
    rail.current?.scrollTo({ left: 0, behavior: "instant" });
  }
  function scroll(direction: number) {
    if (!rail.current) return;
    rail.current.scrollBy({ left: direction * rail.current.clientWidth * 0.85, behavior: reduced ? "instant" : "smooth" });
  }
  return <main className="storefront min-h-screen bg-background font-body text-foreground">
    <header className="store-header">
      <div className="page-width flex h-16 items-center justify-between gap-3 sm:h-20">
        <Link to="/" aria-label="Drummondshop — início"><Brand /></Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Navegação principal">
          <a href="#catalogo" className="nav-link" onClick={() => choose("Todos")}>Produtos</a>
          <a href="#catalogo" className="nav-link" onClick={() => choose("iPhone")}>iPhone</a>
          <a href="#catalogo" className="nav-link" onClick={() => choose("Acessórios")}>Acessórios</a>
        </nav>
        <InstagramLink quiet className="hidden sm:inline-flex"><Instagram /> @drummondshop <ArrowUpRight /></InstagramLink>
        <Button variant="ghost" size="icon" className="size-11 md:hidden" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="menu-mobile" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </div>
      <AnimatePresence>{menuOpen && <motion.nav id="menu-mobile" className="mobile-menu page-width md:hidden" aria-label="Navegação mobile" initial={{ opacity: 0, height: reduced ? "auto" : 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: reduced ? "auto" : 0 }} transition={{ duration: 0.25 }}>
        {SHOP_CATEGORIES.map(value => <a key={value} className="mobile-menu-link" href="#catalogo" onClick={() => choose(value)}>{value === "Todos" ? "Todos os produtos" : value}<ArrowUpRight size={17} /></a>)}
        <a className="mobile-menu-link text-primary" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}><span className="flex items-center gap-2"><Instagram size={18} /> Fale pelo Instagram</span><ArrowUpRight size={17} /></a>
      </motion.nav>}</AnimatePresence>
    </header>

    <section ref={hero} className="store-hero" aria-labelledby="hero-title">
      <motion.div className="hero-picture" style={{ y: reduced ? 0 : parallax }} initial={reduced ? false : { opacity: 0, scale: 1.06, clipPath: "inset(8% 0 0 0)" }} animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}>
        <img src={heroImage} width={1193} height={1400} fetchPriority="high" alt="Smartphones em acabamento titânio, vistos de frente e de costas" className="hero-device" />
      </motion.div>
      <div className="hero-copy page-width">
        <motion.p className="section-label" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>DRUMMONDSHOP</motion.p>
        <motion.h1 id="hero-title" initial={reduced ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }} className="hero-title">Tecnologia que eleva<br className="hidden sm:block" /> <span className="text-primary">sua experiência.</span></motion.h1>
        <motion.p className="hero-subtitle" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}>Encontre seu próximo smartphone na Drummondshop. Os melhores modelos, acessórios e tecnologia em um só lugar.</motion.p>
        <motion.div className="hero-actions" initial={reduced ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          <Button asChild variant="premium"><a href="#catalogo">Explorar produtos <ArrowRight /></a></Button>
          <InstagramLink quiet>Fale pelo Instagram <ArrowUpRight /></InstagramLink>
        </motion.div>
      </div>
      <div className="hero-caption page-width"><span>Design. Potência. Possibilidades.</span><a href="#catalogo" className="nav-link">Conheça a seleção <span aria-hidden="true">↓</span></a></div>
    </section>

    <section id="catalogo" className="catalog-section" aria-labelledby="catalog-title">
      <div className="page-width">
        <Reveal className="catalog-heading">
          <div><p className="section-label">ESCOLHA O SEU PRÓXIMO</p><h2 id="catalog-title" className="section-title">Seu próximo upgrade.</h2></div>
          <p className="max-w-64 text-sm leading-relaxed text-muted-foreground">Os modelos que você procura.<br />Os detalhes que fazem a diferença.</p>
        </Reveal>
        <div className="catalog-toolbar">
          <div className="category-list" role="group" aria-label="Filtrar por categoria">{SHOP_CATEGORIES.map(value => <Button key={value} variant="category" aria-pressed={category === value} onClick={() => choose(value)}>{value}</Button>)}</div>
          <div className="flex shrink-0 gap-2 sm:hidden">
            <Button variant="quiet" size="icon" aria-label="Produtos anteriores" title="Produtos anteriores" onClick={() => scroll(-1)}><ChevronLeft /></Button>
            <Button variant="quiet" size="icon" aria-label="Próximos produtos" title="Próximos produtos" onClick={() => scroll(1)}><ChevronRight /></Button>
          </div>
        </div>
        {products.isPending ? <div className="product-grid" aria-label="Carregando produtos">{[0, 1, 2].map(value => <div key={value} className="skeleton-product motion-safe:animate-pulse" />)}</div> : products.isError ? <div className="catalog-empty"><p>Não foi possível carregar os produtos.</p><Button variant="quiet" onClick={() => products.refetch()}>Tentar novamente</Button></div> : visible.length === 0 ? <div className="catalog-empty"><Smartphone className="mx-auto mb-4 text-primary" /><p>{category === "Todos" ? "Nenhum produto publicado no momento." : "Nenhum produto nesta categoria no momento."}</p><InstagramLink quiet>Consultar disponibilidade <ArrowUpRight /></InstagramLink></div> :
          <motion.div ref={rail} key={category} className="product-grid" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {visible.map((product, index) => <Reveal key={product.id} delay={Math.min(index * 0.08, 0.24)} className="product-slot"><article className="catalog-product group">
              <Button variant="ghost" className="product-image-button" aria-label={`Ver detalhes de ${product.name}`} onClick={() => setSelected(product)}>
                {product.tag && <span className={`product-tag ${product.tag === "Oferta" ? "text-primary" : "text-muted-foreground"}`}>{product.tag}</span>}
                {product.imageUrl ? <img src={product.imageUrl} alt={product.name} width={640} height={640} loading="lazy" decoding="async" className="product-photo" /> : <div className="product-placeholder"><Smartphone size={56} strokeWidth={1} /><span>Imagem indisponível</span></div>}
                <span className="product-plus"><Plus size={18} /></span>
              </Button>
              <div className="product-info"><p className="product-brand">{product.brand}</p><h3><Button variant="link" className="product-name" onClick={() => setSelected(product)}>{product.name}</Button></h3><p className="product-detail">{[product.detail, product.condition].filter(Boolean).join(" · ")}</p>
                <div className="product-prices"><span>{formatPrice(Number(product.price))}</span>{product.old_price !== null && product.old_price > 0 && <del>{formatPrice(Number(product.old_price))}</del>}</div>
                <InstagramLink quiet className="product-contact">Tenho interesse <ArrowUpRight /></InstagramLink>
              </div>
            </article></Reveal>)}
          </motion.div>}
        <Reveal className="catalog-bottom"><span className="text-sm text-muted-foreground">Encontrou o seu favorito?</span><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="nav-link text-sm text-primary">Vamos conversar <ArrowUpRight size={15} /></a></Reveal>
      </div>
    </section>

    <section className="contact-section">
      <Reveal className="page-width contact-inner"><Instagram className="contact-icon" strokeWidth={1} /><p className="section-label">CONECTE-SE COM A DRUMMONDSHOP</p><h2 className="section-title">Seu próximo smartphone<br />começa com uma conversa.</h2><InstagramLink>Fale com a gente <ArrowUpRight /></InstagramLink><a className="nav-link text-sm text-muted-foreground" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">@drummondshop</a></Reveal>
    </section>
    <footer className="store-footer page-width"><div><Link to="/" aria-label="Drummondshop — início"><Brand /></Link><p className="mt-3 text-xs text-muted-foreground">Smartphones. Acessórios. Novas possibilidades.</p></div><div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground"><a className="nav-link" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram <ArrowUpRight size={13} /></a><Link to="/auth" className="nav-link">Área do lojista <ArrowUpRight size={13} /></Link></div><p className="footer-copyright">Drummondshop</p></footer>
    <Button asChild variant="quiet" size="icon" className="instagram-fab"><a aria-label="Conversar com a Drummondshop no Instagram" title="Fale pelo Instagram" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram /></a></Button>

    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="product-dialog">
      {selected && <><div className="detail-photo">{selected.imageUrl ? <img src={selected.imageUrl} alt={selected.name} width={800} height={800} /> : <Smartphone size={72} strokeWidth={1} />}</div><div className="detail-copy"><p className="section-label">{selected.brand}</p><DialogTitle className="mt-3 font-display text-2xl leading-tight sm:text-3xl">{selected.name}</DialogTitle><DialogDescription className="mt-3">{[selected.detail, selected.condition].filter(Boolean).join(" · ")}</DialogDescription>{selected.tag && <p className="mt-3 text-sm text-primary">{selected.tag}</p>}<div className="product-prices mt-5"><span>{formatPrice(Number(selected.price))}</span>{selected.old_price !== null && selected.old_price > 0 && <del>{formatPrice(Number(selected.old_price))}</del>}</div>{selected.description && <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{selected.description}</p>}<InstagramLink className="mt-7 w-full">Consultar disponibilidade <ArrowUpRight /></InstagramLink></div></>}
    </DialogContent></Dialog>
  </main>;
}
