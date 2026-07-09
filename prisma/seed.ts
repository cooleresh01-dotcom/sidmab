import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12)

  await prisma.user.upsert({
    where: { email: 'admin@sidmab.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@sidmab.com', password: hashedPassword, role: 'admin' },
  })

  await prisma.setting.deleteMany()
  await prisma.setting.createMany({
    data: [
      { key: 'site_name', value: 'SIDMAB Events' },
      { key: 'site_tagline', value: 'Transforming Moments into Memories' },
      { key: 'site_logo', value: '/logo.png' },
      { key: 'site_favicon', value: '/favicon.ico' },
      { key: 'site_primary_color', value: '#c0262b' },
      { key: 'site_secondary_color', value: '#1e293b' },
      { key: 'site_email', value: 'info@sidmab.com' },
      { key: 'site_phone', value: '+234 800 123 4567' },
      { key: 'site_address', value: '12 Event Drive, Victoria Island, Lagos, Nigeria' },
      { key: 'social_linkedin', value: 'https://linkedin.com/company/sidmab' },
      { key: 'social_twitter', value: 'https://twitter.com/sidmab' },
      { key: 'social_instagram', value: 'https://instagram.com/sidmab' },
      { key: 'social_facebook', value: 'https://facebook.com/sidmab' },
      { key: 'stat_events', value: '500' },
      { key: 'stat_years', value: '10' },
      { key: 'stat_clients', value: '300' },
      { key: 'stat_satisfaction', value: '98' },
    ],
  })

  await prisma.serviceFAQ.deleteMany()
  await prisma.package.deleteMany()
  await prisma.service.deleteMany()

  const services = [
    {
      title: 'Wedding Planning',
      slug: 'wedding',
      tagline: 'Your Dream Wedding, Perfectly Executed',
      description: 'From intimate ceremonies to grand celebrations, we bring your dream wedding to life with meticulous attention to every detail.',
      icon: '💍',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      features: ['Full wedding planning & coordination', 'Venue selection & decoration', 'Catering & cake design', 'Photography & videography', 'Music & entertainment', 'Guest management'],
      gallery: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
      ],
      featured: true,
      published: true,
      order: 1,
      packages: [
        { name: 'Essential', price: 250000, description: 'Perfect for intimate weddings with up to 50 guests.', features: ['Venue selection assistance', 'Basic decoration', 'Photography (4 hours)', 'Event coordination'] },
        { name: 'Premium', price: 500000, description: 'Our most popular package for mid-sized weddings.', features: ['Full wedding planning', 'Venue decoration', 'Photography & videography', 'Catering coordination', 'Music & entertainment', 'Guest management'] },
        { name: 'Luxury', price: 1000000, description: 'The ultimate wedding experience with no detail overlooked.', features: ['Everything in Premium', 'Custom theme design', 'Aerial drone footage', 'Honeymoon planning', 'Guest accommodation', 'Bridal party styling'] },
      ],
      faqs: [
        { question: 'How far in advance should we book wedding planning?', answer: 'We recommend booking 6-12 months before your planned wedding date for the best experience.' },
        { question: 'Can you plan a destination wedding?', answer: 'Yes, we specialize in destination weddings and can coordinate all aspects regardless of location.' },
      ],
    },
    {
      title: 'Corporate Events',
      slug: 'corporate',
      tagline: 'Professional Events That Impress',
      description: 'Elevate your brand with flawlessly executed corporate events, conferences, and product launches.',
      icon: '🏢',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      features: ['Conferences & seminars', 'Product launches', 'Team building events', 'Award ceremonies', 'Corporate retreats', 'Trade shows & exhibitions'],
      gallery: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      ],
      featured: true,
      published: true,
      order: 2,
      packages: [
        { name: 'Standard', price: 350000, description: 'Ideal for small corporate gatherings and team events.', features: ['Venue booking', 'Basic AV setup', 'Catering arrangement', 'Event coordination'] },
        { name: 'Professional', price: 750000, description: 'Comprehensive package for conferences and seminars.', features: ['Full event planning', 'Advanced AV & staging', 'Professional photography', 'Branded materials', 'Guest registration system'] },
        { name: 'Enterprise', price: 1500000, description: 'End-to-end solution for large corporate events.', features: ['Everything in Professional', 'Multiple venue management', 'Live streaming setup', 'VIP coordination', 'Post-event report'] },
      ],
      faqs: [
        { question: 'Do you handle virtual or hybrid events?', answer: 'Yes, we offer full virtual and hybrid event production services.' },
      ],
    },
    {
      title: 'Birthday Events',
      slug: 'birthday',
      tagline: 'Celebrate Life in Style',
      description: 'Whether it is a milestone birthday or an intimate gathering, we create celebrations that reflect your personality.',
      icon: '🎂',
      image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800',
      features: ['Birthday party planning', 'Theme development', 'Venue decoration', 'Entertainment booking', 'Catering services', 'Party favors & gifts'],
      gallery: [
        'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800',
        'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800',
      ],
      featured: false,
      published: true,
      order: 3,
      packages: [
        { name: 'Basic', price: 100000, description: 'Simple birthday setup for intimate gatherings.', features: ['Venue decoration', 'Birthday cake', 'Basic entertainment', 'Photography (2 hours)'] },
        { name: 'Deluxe', price: 250000, description: 'A memorable birthday experience.', features: ['Theme development', 'Full decoration', 'Catering', 'Photography & videography', 'Entertainment booking'] },
      ],
      faqs: [
        { question: 'Can you arrange surprise birthday parties?', answer: 'Absolutely! We specialize in surprise party coordination.' },
      ],
    },
    {
      title: 'Decoration',
      slug: 'decoration',
      tagline: 'Transforming Spaces into Masterpieces',
      description: 'Our creative design team transforms any venue into a breathtaking space that tells your unique story.',
      icon: '🎨',
      image: 'https://images.unsplash.com/photo-1464699534239-6d4b3cf34b72?w=800',
      features: ['Event styling & design', 'Floral arrangements', 'Lighting design', 'Furniture & props', 'Themed decorations', 'Stage & backdrops'],
      gallery: [
        'https://images.unsplash.com/photo-1464699534239-6d4b3cf34b72?w=800',
        'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800',
      ],
      featured: false,
      published: true,
      order: 4,
      packages: [
        { name: 'Silver', price: 150000, description: 'Basic decoration package for small venues.', features: ['Venue consultation', 'Floral arrangements', 'Table settings', 'Lighting setup'] },
        { name: 'Gold', price: 350000, description: 'Elegant decoration for medium-sized events.', features: ['Custom theme design', 'Premium floral', 'Statement pieces', 'Lighting design', 'Backdrop installation'] },
        { name: 'Platinum', price: 700000, description: 'Luxury transformation for grand events.', features: ['Everything in Gold', 'Full venue transformation', 'Custom furniture', 'Floral ceiling installations', 'LED walls & screens'] },
      ],
      faqs: [
        { question: 'Do you provide decoration for outdoor events?', answer: 'Yes, we specialize in both indoor and outdoor event decoration.' },
      ],
    },
    {
      title: 'Event Coordination',
      slug: 'coordination',
      tagline: 'Seamless Execution, Every Time',
      description: 'Let our experienced coordinators handle the logistics while you enjoy your event stress-free.',
      icon: '📋',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      features: ['Day-of coordination', 'Vendor management', 'Timeline planning', 'Rehearsal coordination', 'Emergency planning', 'Guest management'],
      gallery: [
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      ],
      featured: false,
      published: true,
      order: 5,
      packages: [
        { name: 'Day-of Coordination', price: 120000, description: 'Professional coordination on the day of your event.', features: ['Timeline management', 'Vendor coordination', 'Setup & breakdown', 'Emergency handling'] },
        { name: 'Full Coordination', price: 300000, description: 'Complete coordination from planning to execution.', features: ['Everything in Day-of', 'Vendor sourcing', 'Rehearsal coordination', 'Budget management', 'Guest management'] },
      ],
      faqs: [
        { question: 'Do I still need a coordinator if I have a venue coordinator?', answer: 'Yes, our coordinator works for you, not the venue, ensuring your interests are always prioritized.' },
      ],
    },
    {
      title: 'Rentals',
      slug: 'rentals',
      tagline: 'Premium Event Equipment Rental',
      description: 'High-quality event equipment and furniture rentals to make your event look spectacular.',
      icon: '🪑',
      image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800',
      features: ['Furniture rental', 'Tents & canopies', 'Catering equipment', 'Audio-visual equipment', 'Linens & tableware', 'Lighting equipment'],
      gallery: [
        'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800',
      ],
      featured: false,
      published: true,
      order: 6,
      packages: [
        { name: 'Basic Rental', price: 80000, description: 'Essential items for small events.', features: ['Chairs & tables', 'Basic tableware', 'Linens', 'Delivery & pickup'] },
        { name: 'Premium Rental', price: 200000, description: 'Comprehensive rental package.', features: ['Premium furniture', 'Tents & canopies', 'AV equipment', 'Lighting', 'Linen & tableware', 'Setup & breakdown'] },
      ],
      faqs: [
        { question: 'Do you offer delivery and setup?', answer: 'Yes, delivery, setup, and breakdown are included in all our rental packages.' },
      ],
    },
    {
      title: 'Catering',
      slug: 'catering',
      tagline: 'Exquisite Cuisine for Every Occasion',
      description: 'Delight your guests with exceptional culinary experiences crafted by our talented chefs.',
      icon: '🍽️',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
      features: ['Menu consultation', 'International cuisine', 'Local delicacies', 'Beverage service', 'Dessert stations', 'Dietary accommodations'],
      gallery: [
        'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
      ],
      featured: false,
      published: true,
      order: 7,
      packages: [
        { name: 'Silver Menu', price: 150000, description: 'Delicious catering for up to 50 guests.', features: ['2-course meal', 'Welcome drinks', 'Beverage station', 'Service staff'] },
        { name: 'Gold Menu', price: 350000, description: 'Premium dining experience for up to 100 guests.', features: ['3-course meal', 'International cuisine options', 'Premium beverages', 'Dessert station', 'Professional waitstaff'] },
        { name: 'Platinum Menu', price: 700000, description: 'Gourmet experience for up to 200 guests.', features: ['Custom menu design', 'Multi-course tasting menu', 'Fine wine pairing', 'Interactive food stations', 'Late-night snacks', 'Full service staff'] },
      ],
      faqs: [
        { question: 'Can you accommodate dietary restrictions?', answer: 'Yes, we cater to all dietary requirements including vegetarian, vegan, halal, and allergen-free options.' },
      ],
    },
    {
      title: 'Ushering',
      slug: 'ushering',
      tagline: 'Elegant & Professional Ushering Services',
      description: 'Our trained ushers provide warm, professional service to ensure your guests feel welcome from the moment they arrive.',
      icon: '👔',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
      features: ['Professional ushers', 'Uniform provision', 'Guest reception', 'Program distribution', 'Seating arrangement', 'Gift collection'],
      gallery: [
        'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
      ],
      featured: false,
      published: true,
      order: 8,
      packages: [
        { name: 'Standard', price: 60000, description: 'Professional ushering for small events.', features: ['4 ushers', 'Uniform provision', 'Guest reception', 'Program distribution'] },
        { name: 'Premium', price: 150000, description: 'Comprehensive ushering for large events.', features: ['8+ ushers', 'Custom uniforms', 'Guest reception', 'Seating arrangement', 'Gift collection', 'VIP escort'] },
      ],
      faqs: [
        { question: 'Are the ushers trained?', answer: 'Yes, all our ushers undergo comprehensive training in etiquette, guest relations, and event protocols.' },
      ],
    },
  ]

  for (const svc of services) {
    const { packages, faqs, ...serviceData } = svc
    const created = await prisma.service.create({ data: serviceData })

    for (const pkg of packages) {
      await prisma.package.create({
        data: { ...pkg, serviceId: created.id },
      })
    }

    for (const faq of faqs) {
      await prisma.serviceFAQ.create({
        data: { ...faq, serviceId: created.id },
      })
    }
  }

  await prisma.portfolio.deleteMany()
  await prisma.portfolio.createMany({
    data: [
      { title: 'Luxury Wedding', slug: 'luxury-wedding', category: 'wedding', images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=600', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600'], description: 'A grand wedding celebration with 500 guests, featuring exquisite floral arrangements and live entertainment.', client: 'Chioma & Ade', date: new Date('2025-12-15'), featured: true, published: true },
      { title: 'Tech Conference 2025', slug: 'tech-conference-2025', category: 'corporate', images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'], description: 'Annual tech conference for 1000+ attendees with keynote speeches, workshops, and networking sessions.', client: 'TechBridge Nigeria', date: new Date('2025-11-20'), featured: true, published: true },
      { title: 'Garden Birthday', slug: 'garden-birthday', category: 'birthday', images: ['https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600'], description: '50th birthday celebration in a beautiful garden setting with outdoor dining and live music.', client: 'Amara E.', date: new Date('2026-01-10'), featured: false, published: true },
      { title: 'Corporate Gala Dinner', slug: 'corporate-gala-dinner', category: 'corporate', images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600'], description: 'Annual corporate gala dinner with awards ceremony and entertainment.', client: 'First Bank PLC', date: new Date('2025-09-30'), featured: true, published: true },
      { title: 'Outdoor Wedding', slug: 'outdoor-wedding', category: 'wedding', images: ['https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600'], description: 'Beautiful outdoor wedding ceremony by the beach with sunset reception.', client: 'Tunde & Bisola', date: new Date('2026-02-14'), featured: true, published: true },
      { title: 'Decoration Showcase', slug: 'decoration-showcase', category: 'decoration', images: ['https://images.unsplash.com/photo-1464699534239-6d4b3cf34b72?w=600'], description: 'Luxury event decoration showcase featuring our award-winning design portfolio.', client: 'SIDMAB Events', date: new Date('2026-03-01'), featured: false, published: true },
      { title: 'Birthday Pool Party', slug: 'birthday-pool-party', category: 'birthday', images: ['https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600'], description: 'Poolside birthday celebration with DJ, catering, and themed decorations.', client: 'David O.', date: new Date('2026-04-05'), featured: false, published: true },
      { title: 'Product Launch Event', slug: 'product-launch-event', category: 'corporate', images: ['https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600'], description: 'Major product launch event with media coverage and VIP guest experience.', client: 'Gloo Technologies', date: new Date('2026-05-20'), featured: true, published: true },
    ],
  })

  await prisma.gallery.deleteMany()
  await prisma.gallery.createMany({
    data: [
      { title: 'Wedding Ceremony Setup', type: 'image', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', category: 'Wedding' },
      { title: 'Conference Hall', type: 'image', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600', category: 'Corporate' },
      { title: 'Birthday Decoration', type: 'image', url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=600', category: 'Birthday' },
      { title: 'Event Venue Tour', type: 'video', url: 'https://www.youtube.com/watch?v=example1', thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600', category: 'Corporate' },
      { title: 'Aerial Venue View', type: 'drone', url: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600', thumbnail: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600', category: 'Decoration' },
      { title: 'Before & After', type: 'before-after', url: 'https://images.unsplash.com/photo-1464699534239-6d4b3cf34b72?w=600', thumbnail: 'https://images.unsplash.com/photo-1464699534239-6d4b3cf34b72?w=600', before: 'https://images.unsplash.com/photo-1464699534239-6d4b3cf34b72?w=600', after: 'https://images.unsplash.com/photo-1464699534239-6d4b3cf34b72?w=600', category: 'Decoration' },
      { title: 'Garden Reception', type: 'image', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600', category: 'Wedding' },
      { title: 'Stage Design', type: 'image', url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600', category: 'Corporate' },
      { title: 'Pool Party Setup', type: 'image', url: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600', category: 'Birthday' },
      { title: 'Catering Presentation', type: 'image', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600', category: 'Catering' },
    ],
  })

  await prisma.team.deleteMany()
  await prisma.team.createMany({
    data: [
      { name: 'Sarah Johnson', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', bio: 'With over 15 years of experience in event management, Sarah founded SIDMAB with a vision to transform the Nigerian events industry.', experience: 15, linkedin: 'https://linkedin.com/in/sarahjohnson', twitter: 'https://twitter.com/sarahjohnson', instagram: 'https://instagram.com/sarahjohnson', published: true, order: 1 },
      { name: 'Michael Obi', role: 'Creative Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', bio: 'Michael brings artistic vision and innovation to every event, ensuring each celebration is uniquely memorable.', experience: 12, linkedin: 'https://linkedin.com/in/michaelobi', twitter: 'https://twitter.com/michaelobi', published: true, order: 2 },
      { name: 'Emily Okonkwo', role: 'Operations Manager', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', bio: 'Emily ensures seamless execution of every event with her meticulous planning and organizational expertise.', experience: 10, linkedin: 'https://linkedin.com/in/emilyokonkwo', instagram: 'https://instagram.com/emilyokonkwo', published: true, order: 3 },
      { name: 'David Adeleke', role: 'Head of Design', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', bio: 'David leads our design team in creating stunning visual experiences that captivate and inspire.', experience: 8, twitter: 'https://twitter.com/davidadeleke', instagram: 'https://instagram.com/davidadeleke', facebook: 'https://facebook.com/davidadeleke', published: true, order: 4 },
    ],
  })

  await prisma.testimonial.deleteMany()
  await prisma.testimonial.createMany({
    data: [
      { name: 'Chioma & Ade', role: 'Happy Couple', company: '', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200', content: 'SIDMAB made our wedding day absolutely perfect! Every detail was thoughtfully planned and executed beyond our expectations.', rating: 5, featured: true, published: true },
      { name: 'James O.', role: 'CEO', company: 'TechBridge Nigeria', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', content: 'The team at SIDMAB handled our annual conference flawlessly. Professional, creative, and incredibly organized.', rating: 5, featured: true, published: true },
      { name: 'Amara E.', role: 'Birthday Celebrant', company: '', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', content: 'My 30th birthday was everything I dreamed of and more. SIDMAB turned my vision into reality!', rating: 5, featured: false, published: true },
      { name: 'Dr. Bello', role: 'Director', company: 'Lagos Business School', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', content: 'Exceptional service quality and attention to detail. SIDMAB is our go-to event management partner.', rating: 4, featured: false, published: true },
      { name: 'Tunde & Bisola', role: 'Event Hosts', company: 'Naija Tech Summit', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200', content: 'From planning to execution, SIDMAB delivered a world-class tech summit. The feedback from our attendees was overwhelmingly positive.', rating: 5, featured: true, published: true },
      { name: 'Ngozi M.', role: 'Program Director', company: 'Uplift Africa Foundation', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200', content: 'SIDMAB helped us host our annual charity gala with grace and precision. They understood our mission and brought it to life beautifully.', rating: 5, featured: true, published: true },
      { name: 'Femi A.', role: 'Brand Manager', company: 'Pulse Beverages', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', content: 'Our product launch was a massive success thanks to SIDMAB. The creative concepts and flawless execution set a new standard for us.', rating: 5, featured: false, published: true },
      { name: 'Simi & Kunle', role: 'Happy Couple', company: '', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200', content: 'We still get compliments about our wedding months later. SIDMAB turned our dream day into a magical reality we will never forget.', rating: 5, featured: true, published: true },
    ],
  })

  await prisma.blog.deleteMany()
  await prisma.blog.createMany({
    data: [
      { title: '10 Tips for Planning the Perfect Wedding', slug: 'tips-for-perfect-wedding', excerpt: 'Planning a wedding can be overwhelming. Here are our top tips to make the process smooth and enjoyable.', content: '<h2>Start Early</h2><p>The key to a stress-free wedding is starting your planning well in advance. We recommend 12-18 months for a full wedding.</p><h2>Set a Budget</h2><p>Determine your budget early and stick to it. Be realistic about what you can afford and prioritize what matters most to you.</p><h2>Choose the Right Venue</h2><p>Your venue sets the tone for your entire wedding. Visit multiple options and consider factors like capacity, location, and ambiance.</p><h2>Hire Professionals</h2><p>Don\'t try to do everything yourself. Professional planners, photographers, and caterers bring expertise that makes a significant difference.</p>', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600', author: 'Sarah Johnson', tags: ['Wedding', 'Planning'], featured: true, published: true },
      { title: 'Corporate Event Trends to Watch in 2026', slug: 'corporate-event-trends-2026', excerpt: 'Stay ahead of the curve with the latest trends shaping corporate events this year.', content: '<h2>Hybrid Events</h2><p>The future of corporate events is hybrid. Combining in-person and virtual elements allows for greater reach and flexibility.</p><h2>Sustainability</h2><p>Eco-friendly events are no longer optional. From sustainable materials to carbon-neutral venues, green practices are essential.</p><h2>Immersive Experiences</h2><p>Technology is enabling more immersive event experiences through AR, VR, and interactive installations.</p>', image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600', author: 'Michael Obi', tags: ['Corporate', 'Trends'], featured: true, published: true },
      { title: 'How to Choose the Right Event Venue', slug: 'choose-right-event-venue', excerpt: 'The venue sets the tone for your entire event. Learn how to make the perfect choice.', content: '<h2>Consider Your Guest List</h2><p>The size of your guest list is the most important factor in venue selection. Choose a space that comfortably accommodates your guests.</p><h2>Location Matters</h2><p>Choose a venue that is accessible for your guests. Consider parking, public transportation, and accommodation options nearby.</p><h2>Check the Amenities</h2><p>What does the venue provide? In-house catering, AV equipment, and furniture can significantly reduce your rental needs.</p>', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600', author: 'Emily Okonkwo', tags: ['Venue', 'Tips'], featured: false, published: true },
    ],
  })

  await prisma.fAQ.deleteMany()
  await prisma.fAQ.createMany({
    data: [
      { question: 'What services does SIDMAB offer?', answer: 'SIDMAB offers comprehensive event planning and management services including wedding planning, corporate events, birthday celebrations, decoration, event coordination, rentals, catering, and ushering services.', category: 'General', order: 1 },
      { question: 'How far in advance should I book?', answer: 'We recommend booking at least 3-6 months in advance for major events like weddings, and 2-4 weeks for smaller events.', category: 'General', order: 2 },
      { question: 'Do you offer custom packages?', answer: 'Yes! We work with you to create a custom package that fits your specific needs, preferences, and budget.', category: 'General', order: 3 },
      { question: 'How does the booking process work?', answer: 'You can book through our website by filling out the consultation form, calling us directly, or visiting our office.', category: 'Booking & Payments', order: 4 },
      { question: 'What payment methods do you accept?', answer: 'We accept bank transfers, mobile payments, and credit/debit cards.', category: 'Booking & Payments', order: 5 },
      { question: 'Can I get a refund if I cancel?', answer: 'Our cancellation policy varies depending on how far in advance you cancel. Please refer to our terms and conditions.', category: 'Booking & Payments', order: 6 },
      { question: 'Do you handle both small and large events?', answer: 'Absolutely! We handle events of all sizes, from intimate gatherings of 20 guests to large-scale celebrations with 1000+ attendees.', category: 'Events', order: 7 },
      { question: 'Can you work with my existing vendors?', answer: 'Yes, we are happy to collaborate with your preferred vendors.', category: 'Events', order: 8 },
      { question: 'Do you provide event insurance?', answer: 'We strongly recommend event insurance and can guide you on the best options.', category: 'Events', order: 9 },
    ],
  })
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
