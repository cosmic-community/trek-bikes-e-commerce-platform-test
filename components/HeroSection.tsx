import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle: string
  backgroundImage: string
  buttons?: Array<{
    text: string
    href: string
    variant?: 'primary' | 'secondary'
  }>
}

export default function HeroSection({ 
  title, 
  subtitle, 
  backgroundImage, 
  buttons = [] 
}: HeroSectionProps) {
  return (
    <section 
      className="relative h-[70vh] bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto hero-text">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        
        {/* Action buttons */}
        {buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {buttons.map((button, index) => (
              <Link
                key={index}
                href={button.href}
                className={
                  button.variant === 'secondary'
                    ? 'btn-secondary'
                    : 'btn-primary'
                }
              >
                {button.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}