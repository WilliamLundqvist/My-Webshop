"use client";
import React from 'react'
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from 'next/navigation'


const BackButton = () => {
    const router = useRouter();

  return (
 
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>

  )
}

export default BackButton