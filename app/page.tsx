"use client"

import { useRequireAuth } from "@/lib/auth"
import InspectionForm from "@/components/inspection-form"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { manager, isLoading } = useRequireAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#DBD3D3]/20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#024CAA]" />
          <p className="text-lg">טוען...</p>
        </div>
      </div>
    )
  }

  if (!manager) {
    return null // useRequireAuth ינווט אוטומטית לדף ההתחברות
  }

  return (
    <main className="min-h-screen p-2 md:p-8 bg-[#DBD3D3]/20">
      <InspectionForm managerId={manager.id} managerName={manager.name} />
    </main>
  )
}
