export default function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-8">
      <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.75rem]">{title}</h1>
      {description ? <p className="mt-2 max-w-[72ch] text-[0.9375rem] text-muted">{description}</p> : null}
    </header>
  );
}
