"use client"

import { useEffect, useState } from "react"
import { JobCard } from "@/components/job-card"
import { JobPosting } from "@/lib/types"

export function JobList() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://empleo-pm-back-end-app.onrender.com/api/ofertas")
        const data = await response.json()
        setJobs(data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) {
    return <div>Cargando ofertas de empleo...</div>
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
