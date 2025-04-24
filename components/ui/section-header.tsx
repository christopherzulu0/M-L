interface SectionHeaderProps {
  title: string
  subtitle: string
  align?: "left" | "center"
}

export function SectionHeader({ title, subtitle, align = "center" }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
      <h2 className="mb-3 text-4xl font-bold tracking-tight lg:text-5xl">{title}</h2>
      <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">{subtitle}</p>
    </div>
  )
}
