import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

const footerSections = [
  {
    title: "Empresa",
    links: [
      { label: "Sobre Nós", href: "/empresa" },
      { label: "Portfólio", href: "/portfolio" },
      { label: "Pacotes", href: "/pacotes" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Serviços",
    links: [
      { label: "Arquitetura", href: "/arquitetura" },
      { label: "Engenharia", href: "/engenharia" },
      { label: "Topografia", href: "/servicos" },
      { label: "Visualização 3D", href: "/servicos" },
    ],
  },
  {
    title: "Engenharia",
    links: [
      { label: "Engenharia Civil", href: "/engenharia" },
      { label: "Engenharia Estrutural", href: "/engenharia" },
      { label: "Engenharia Ambiental", href: "/engenharia" },
      { label: "Planeamento Urbano", href: "/engenharia" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-[#303030] text-[#e0e0e0]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Image
                src="/images/logo-horizontal.png"
                alt="KIXINDE YA NGONGO"
                width={200}
                height={50}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed text-[#b0b0b0] max-w-sm mb-6">
              Unimos a sabedoria do territorio a tecnologia do futuro. Engenharia e construcao civil para transformar Angola.
            </p>
            <div className="flex flex-col gap-3 text-sm text-[#b0b0b0]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#F7A71C]" />
                <span>Luanda, Angola</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#F7A71C]" />
                <span>+244 923 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#F7A71C]" />
                <span>geral@kixindeyangongo.ao</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#ffffff] font-serif">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#b0b0b0] hover:text-[#F7A71C] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-[#404040] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#808080]">
            {new Date().getFullYear()} KIXINDE YA NGONGO. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/empresa" className="text-xs text-[#808080] hover:text-[#F7A71C] transition-colors">
              Termos
            </Link>
            <Link href="/empresa" className="text-xs text-[#808080] hover:text-[#F7A71C] transition-colors">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
