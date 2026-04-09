"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const contactInfo = [
  {
    icon: MapPin,
    title: "Localização",
    details: ["Luanda, Angola"],
  },
  {
    icon: Phone,
    title: "Telefone",
    details: ["+244 926 899 866"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["geral@kixindeyangongo.ao"],
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    details: ["+244 926 899 866"],
  },
]

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="pt-[73px]">
      {/* Hero */}
      <section className="relative py-32 bg-[#303030]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#F7A71C] font-sans">Fale Connosco</p>
          <h1 className="text-4xl font-bold text-[#ffffff] md:text-5xl lg:text-6xl font-serif text-balance">
            Contacto
          </h1>
          <p className="mt-4 text-lg text-[#c0c0c0] max-w-2xl font-sans leading-relaxed">
            Estamos prontos para transformar o seu projeto em realidade. Entre em contacto connosco.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold text-foreground font-serif">Informações de Contacto</h2>
              <p className="mb-10 text-base leading-relaxed text-muted-foreground font-sans">
                Visite-nos no nosso escritório em Luanda ou entre em contacto através dos nossos canais de comunicação.
              </p>

              <div className="flex flex-col gap-8">
                {contactInfo.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F7A71C]/10">
                      <item.icon className="h-5 w-5 text-[#F7A71C]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground font-serif">{item.title}</h4>
                      {item.details.map((detail, j) => (
                        <p key={j} className="text-sm text-muted-foreground font-sans">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-10">
                <a
                  href="https://wa.me/244926899866?text=Olá! Gostaria de mais informações sobre os serviços da KIXINDE YA NGONGO."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-[#ffffff] hover:bg-[#20b858] transition-colors font-sans"
                >
                  <MessageCircle className="h-5 w-5" />
                  Falar pelo WhatsApp
                </a>
              </div>

              {/* Map */}
              <div className="mt-10 rounded-lg overflow-hidden border border-border aspect-[4/3]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125466.76637387504!2d13.18986905!3d-8.8383333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f15cdc4f02e7%3A0x7a69becc896e4588!2sLuanda%2C%20Angola!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização KIXINDE YA NGONGO em Luanda, Angola"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="flex items-center justify-center rounded-lg border border-border p-16">
                  <div className="text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7A71C]/15">
                        <CheckCircle2 className="h-8 w-8 text-[#F7A71C]" />
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-foreground font-serif">Mensagem Enviada</h3>
                    <p className="mb-6 text-sm text-muted-foreground font-sans max-w-sm">
                      Obrigado pelo seu contacto. A nossa equipa irá responder no prazo de 24 horas.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      className="bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold"
                    >
                      Enviar Nova Mensagem
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border p-8 md:p-12">
                  <h2 className="mb-2 text-2xl font-bold text-foreground font-serif">Enviar Mensagem</h2>
                  <p className="mb-8 text-sm text-muted-foreground font-sans">
                    Preencha o formulário e entraremos em contacto consigo brevemente.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="contact-name" className="text-sm font-medium text-foreground font-sans">Nome</Label>
                        <Input
                          id="contact-name"
                          required
                          placeholder="O seu nome"
                          className="font-sans"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="contact-phone" className="text-sm font-medium text-foreground font-sans">Telefone</Label>
                        <Input
                          id="contact-phone"
                          required
                          type="tel"
                          placeholder="+244 926 899 866"
                          className="font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contact-email" className="text-sm font-medium text-foreground font-sans">Email</Label>
                      <Input
                        id="contact-email"
                        required
                        type="email"
                        placeholder="email@exemplo.com"
                        className="font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contact-subject" className="text-sm font-medium text-foreground font-sans">Assunto</Label>
                      <Input
                        id="contact-subject"
                        required
                        placeholder="Assunto da mensagem"
                        className="font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contact-message" className="text-sm font-medium text-foreground font-sans">Mensagem</Label>
                      <Textarea
                        id="contact-message"
                        required
                        rows={6}
                        placeholder="Escreva a sua mensagem..."
                        className="font-sans"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-[#F7A71C] text-[#303030] hover:bg-[#d99116] font-sans font-semibold text-base"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
