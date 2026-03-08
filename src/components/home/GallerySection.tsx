const shots = [
  {
    src: '/gallery-ballroom.png',
    label: 'Grand Ballroom',
    caption: 'Lavish setup for celebrations of every scale',
    span: 'col-span-2 row-span-2',
  },
  {
    src: '/gallery-corridor.png',
    label: 'Elegant Corridor',
    caption: 'Gold art-deco details throughout every hallway',
    span: '',
  },
  {
    src: '/gallery-lounge.png',
    label: 'The Lounge',
    caption: 'Intimate seating for pre-event cocktails',
    span: '',
  },
  {
    src: '/gallery-reception.png',
    label: 'Reception Lobby',
    caption: 'A warm welcome awaits every guest',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/3951652/pexels-photo-3951652.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1',
    label: 'Garden Terrace',
    caption: 'Al-fresco dining under open skies',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/5103610/pexels-photo-5103610.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&dpr=1',
    label: 'Executive Suite',
    caption: 'Refined space for meetings & private galas',
    span: '',
  },
]

export function GallerySection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">
            Our Spaces
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-brand-green sm:text-4xl">
            A Venue for Every Occasion
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-500">
            From intimate gatherings to grand celebrations — explore the
            elegance and versatility of Melian Event Center.
          </p>
        </div>

        {/* Mosaic grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-[280px_280px]">
          {shots.map((shot, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl ${shot.span}`}
            >
              <img
                src={shot.src}
                alt={shot.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green/70 via-transparent to-transparent" />
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <p className="font-serif text-base font-semibold text-white sm:text-lg">
                  {shot.label}
                </p>
                <p className="mt-0.5 text-xs text-white/75 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {shot.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
