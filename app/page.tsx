import { JobList } from "@/components/job-list";


export default function HomePage () {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4 max-w-3xl mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Encuenta tu proximo empleo en Puerto Madryn</h1>
        <p className="text-muted-foreground text-base sm:text-lg">Explora las ultimas ofertas laborales de toda la ciudad</p>
      </section>
      <JobList />
    </div>
  )
}