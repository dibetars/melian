'use client'

import { useState, useRef, useCallback } from 'react'
import { Download, Copy, CheckCheck, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

function randomCode() {
  const prefix = 'MELIAN'
  const suffix = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `${prefix}-${suffix}`
}

export function CouponGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const [code, setCode] = useState(randomCode)
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent')
  const [discountValue, setDiscountValue] = useState('10')
  const [description, setDescription] = useState('Valid on any space booking')
  const [expiry, setExpiry] = useState('')
  const [copied, setCopied] = useState(false)

  const discountLabel =
    discountType === 'percent'
      ? `${discountValue}% OFF`
      : `GHS ${discountValue} OFF`

  const drawCoupon = useCallback((): HTMLCanvasElement => {
    const canvas = document.createElement('canvas')
    canvas.width = 900
    canvas.height = 420
    const ctx = canvas.getContext('2d')!

    // Background
    ctx.fillStyle = '#1D2755'
    ctx.fillRect(0, 0, 900, 420)

    // Gold accent strip
    ctx.fillStyle = '#ECC356'
    ctx.fillRect(0, 0, 12, 420)
    ctx.fillRect(888, 0, 12, 420)

    // Dashed separator
    ctx.setLineDash([10, 8])
    ctx.strokeStyle = 'rgba(236,195,86,0.35)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(580, 40)
    ctx.lineTo(580, 380)
    ctx.stroke()
    ctx.setLineDash([])

    // Scissors icon hint
    ctx.font = '22px serif'
    ctx.fillStyle = 'rgba(236,195,86,0.5)'
    ctx.fillText('✂', 567, 36)

    // Left side — brand + description
    ctx.fillStyle = '#ECC356'
    ctx.font = 'bold 52px serif'
    ctx.fillText('MELIAN', 50, 120)

    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.font = '15px sans-serif'
    ctx.fillText('EVENT CENTRE', 52, 148)

    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = '18px sans-serif'
    // Word-wrap description
    const words = description.split(' ')
    let line = ''
    let y = 210
    for (const word of words) {
      const test = line + word + ' '
      if (ctx.measureText(test).width > 480 && line !== '') {
        ctx.fillText(line.trim(), 52, y)
        line = word + ' '
        y += 28
      } else {
        line = test
      }
    }
    ctx.fillText(line.trim(), 52, y)

    if (expiry) {
      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.font = '14px sans-serif'
      const exp = new Date(expiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      ctx.fillText(`Valid until ${exp}`, 52, y + 44)
    }

    // Right side — discount + code
    ctx.textAlign = 'center'

    ctx.fillStyle = '#ECC356'
    ctx.font = `bold ${discountValue.length > 3 ? 58 : 68}px sans-serif`
    ctx.fillText(discountLabel, 738, 185)

    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '14px sans-serif'
    ctx.fillText('USE CODE', 738, 240)

    // Code box
    ctx.fillStyle = 'rgba(236,195,86,0.15)'
    const codeBoxX = 620, codeBoxW = 240, codeBoxH = 52
    const codeBoxY = 258
    ctx.beginPath()
    ctx.roundRect(codeBoxX, codeBoxY, codeBoxW, codeBoxH, 8)
    ctx.fill()
    ctx.strokeStyle = '#ECC356'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = '#ECC356'
    ctx.font = 'bold 26px monospace'
    ctx.fillText(code, 738, 293)

    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.font = '12px sans-serif'
    ctx.fillText('melianevents.com', 738, 370)

    ctx.textAlign = 'left'
    return canvas
  }, [code, discountLabel, description, expiry, discountValue])

  function handleDownload() {
    const canvas = drawCoupon()
    const link = document.createElement('a')
    link.download = `melian-coupon-${code}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  async function handleCopyImage() {
    try {
      const canvas = drawCoupon()
      canvas.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      })
    } catch {
      // Fallback: copy code text
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">

      {/* Controls */}
      <Card>
        <CardContent className="space-y-5 pt-6">
          {/* Code */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Coupon Code</label>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm uppercase outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCode(randomCode())}
                title="Generate random code"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Discount type + value */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Discount</label>
            <div className="flex gap-2">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percent' | 'fixed')}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed (GHS)</option>
              </select>
              <input
                type="number"
                value={discountValue}
                min={1}
                max={discountType === 'percent' ? 100 : undefined}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Valid on any space booking"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          {/* Expiry */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Expiry Date <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleDownload} className="flex-1 gap-2">
              <Download className="h-4 w-4" /> Download PNG
            </Button>
            <Button variant="outline" onClick={handleCopyImage} className="flex-1 gap-2">
              {copied
                ? <><CheckCheck className="h-4 w-4 text-green-600" /> Copied!</>
                : <><Copy className="h-4 w-4" /> Copy Image</>
              }
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live preview */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Preview</p>
        <div
          ref={previewRef}
          className="relative w-full overflow-hidden rounded-2xl shadow-xl"
          style={{ background: '#1D2755', aspectRatio: '900/420' }}
        >
          {/* Gold edge accents */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-brand-gold rounded-l-2xl" />
          <div className="absolute inset-y-0 right-0 w-2.5 bg-brand-gold rounded-r-2xl" />

          {/* Dashed divider */}
          <div className="absolute inset-y-4 right-[35%] border-l border-dashed border-brand-gold/30" />
          <span className="absolute top-2 right-[35%] -translate-x-1/2 text-brand-gold/40 text-lg">✂</span>

          {/* Left content */}
          <div className="absolute inset-y-0 left-6 right-[37%] flex flex-col justify-center gap-1 py-6">
            <p className="font-serif text-3xl font-bold text-brand-gold leading-none">MELIAN</p>
            <p className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Event Centre</p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{description}</p>
            {expiry && (
              <p className="mt-2 text-xs text-white/40">
                Valid until {new Date(expiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>

          {/* Right content */}
          <div className="absolute inset-y-0 right-0 left-[65%] flex flex-col items-center justify-center gap-3 px-4">
            <p className="text-center font-bold text-brand-gold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 1 }}>
              {discountLabel}
            </p>
            <div>
              <p className="text-center text-[10px] uppercase tracking-widest text-white/50 mb-1">Use Code</p>
              <div className="rounded-lg border border-brand-gold/50 bg-brand-gold/10 px-4 py-1.5 text-center font-mono text-sm font-bold text-brand-gold tracking-wider">
                {code}
              </div>
            </div>
            <p className="text-[10px] text-white/30">melianevents.com</p>
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          Live preview · Download exports a high-res PNG
        </p>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
