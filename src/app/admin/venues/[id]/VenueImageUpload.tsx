'use client'

import { useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { addVenueImage } from '@/actions/venues'
import type { Venue } from '@/types'

export function VenueImageUpload({ venue }: { venue: Venue }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    startTransition(async () => {
      const ext = file.name.split('.').pop()
      const path = `${venue.id}/${Date.now()}.${ext}`

      const { error } = await supabase.storage.from('venue-images').upload(path, file)
      if (error) { toast.error(error.message); return }

      const { data } = supabase.storage.from('venue-images').getPublicUrl(path)
      const result = await addVenueImage(venue, data.publicUrl)
      if (result.error) toast.error(result.error)
      else { toast.success('Image uploaded.'); router.refresh() }
    })
  }

  return (
    <Card>
      <CardHeader><h2 className="font-semibold">Images</h2></CardHeader>
      <CardContent className="space-y-4">
        {venue.images.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {venue.images.map((img, i) => (
              <div key={i} className="relative h-24 overflow-hidden rounded-lg">
                <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            variant="outline"
            size="sm"
            loading={isPending}
            onClick={() => inputRef.current?.click()}
          >
            Upload Image
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
