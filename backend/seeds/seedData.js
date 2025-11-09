const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Package = require('../models/Package');

// Load environment variables
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const packages = [
  {
    name: 'Paris Romantic Getaway',
    destination: 'Paris, France',
    description: 'Experience the city of love with this romantic 5-day package. Visit the Eiffel Tower, Louvre Museum, and enjoy authentic French cuisine. Perfect for couples looking for an unforgettable experience.',
    price: 1299,
    duration: 5,
    maxPeople: 4,
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f'
    ],
    includes: [
      'Round-trip flights',
      '4-star hotel accommodation',
      'Daily breakfast',
      'Eiffel Tower tickets',
      'Louvre Museum entry',
      'Seine River cruise',
      'Local tour guide'
    ],
    excludes: [
      'Lunch and dinner',
      'Travel insurance',
      'Personal expenses',
      'Additional activities'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Check-in', description: 'Arrive in Paris, check into hotel, evening Seine River cruise' },
      { day: 2, title: 'Eiffel Tower & Champs-Élysées', description: 'Visit Eiffel Tower, walk along Champs-Élysées' },
      { day: 3, title: 'Louvre & Notre-Dame', description: 'Explore the Louvre Museum, visit Notre-Dame Cathedral' },
      { day: 4, title: 'Versailles Day Trip', description: 'Full day excursion to Palace of Versailles' },
      { day: 5, title: 'Departure', description: 'Free morning for shopping, afternoon departure' }
    ],
    category: 'luxury',
    rating: 4.8
  },
  {
    name: 'Bali Beach Paradise',
    destination: 'Bali, Indonesia',
    description: 'Relax in tropical paradise with pristine beaches, ancient temples, and vibrant culture. This 7-day package includes beach activities, temple tours, and traditional Balinese experiences.',
    price: 899,
    duration: 7,
    maxPeople: 6,
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2'
    ],
    includes: [
      'Round-trip flights',
      'Beach resort accommodation',
      'All meals included',
      'Temple tour',
      'Snorkeling equipment',
      'Surfing lessons',
      'Traditional dance show'
    ],
    excludes: [
      'Spa treatments',
      'Scuba diving',
      'Travel insurance',
      'Airport transfers'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Beach Time', description: 'Arrive in Bali, settle in at beach resort' },
      { day: 2, title: 'Ubud Cultural Tour', description: 'Visit rice terraces, monkey forest, and art markets' },
      { day: 3, title: 'Water Sports', description: 'Snorkeling, surfing lessons at Kuta Beach' },
      { day: 4, title: 'Temple Tour', description: 'Visit Tanah Lot, Uluwatu Temple, watch sunset' },
      { day: 5, title: 'Relaxation Day', description: 'Free day to enjoy beach and resort facilities' },
      { day: 6, title: 'Adventure Day', description: 'Waterfall trekking, traditional cooking class' },
      { day: 7, title: 'Departure', description: 'Breakfast, check-out, departure' }
    ],
    category: 'relaxation',
    rating: 4.9
  },
  {
    name: 'Swiss Alps Adventure',
    destination: 'Interlaken, Switzerland',
    description: 'Adventure in the stunning Swiss Alps with hiking, paragliding, and breathtaking mountain views. Perfect for thrill-seekers and nature lovers.',
    price: 1599,
    duration: 6,
    maxPeople: 8,
    images: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'
    ],
    includes: [
      'Round-trip flights',
      'Mountain lodge accommodation',
      'Daily breakfast',
      'Paragliding experience',
      'Jungfraujoch train tickets',
      'Hiking guide',
      'Cable car passes'
    ],
    excludes: [
      'Lunch and dinner',
      'Ski equipment rental',
      'Travel insurance',
      'Additional activities'
    ],
    itinerary: [
      { day: 1, title: 'Arrival', description: 'Arrive in Interlaken, explore town' },
      { day: 2, title: 'Jungfraujoch', description: 'Visit Top of Europe by train' },
      { day: 3, title: 'Paragliding', description: 'Tandem paragliding over Interlaken' },
      { day: 4, title: 'Hiking Day', description: 'Guided mountain hiking trail' },
      { day: 5, title: 'Adventure Activities', description: 'Zip-lining, canyoning, or mountain biking' },
      { day: 6, title: 'Departure', description: 'Morning free time, afternoon departure' }
    ],
    category: 'adventure',
    rating: 4.7
  },
  {
    name: 'Tokyo Family Experience',
    destination: 'Tokyo, Japan',
    description: 'Explore modern Tokyo with the whole family. Visit theme parks, temples, and experience Japanese culture. Kid-friendly activities and accommodations.',
    price: 1499,
    duration: 8,
    maxPeople: 6,
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf',
      'https://images.unsplash.com/photo-1513407030348-c983a97b98d8'
    ],
    includes: [
      'Round-trip flights',
      'Family hotel rooms',
      'Daily breakfast',
      'Tokyo Disneyland tickets',
      'Sumo wrestling show',
      'Traditional tea ceremony',
      'City tour with guide'
    ],
    excludes: [
      'Lunch and dinner',
      'Shopping expenses',
      'Travel insurance',
      'Additional theme park days'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Orientation', description: 'Arrive in Tokyo, check in, neighborhood exploration' },
      { day: 2, title: 'Tokyo Disneyland', description: 'Full day at Tokyo Disneyland' },
      { day: 3, title: 'Traditional Tokyo', description: 'Visit temples, experience tea ceremony' },
      { day: 4, title: 'Modern Tokyo', description: 'Explore Shibuya, Harajuku, teamLab Borderless' },
      { day: 5, title: 'Mount Fuji Day Trip', description: 'Excursion to Mount Fuji area' },
      { day: 6, title: 'Shopping & Entertainment', description: 'Akihabara electronics, Pokemon Center, arcade games' },
      { day: 7, title: 'Sumo & Cultural Show', description: 'Sumo wrestling, traditional performances' },
      { day: 8, title: 'Departure', description: 'Last-minute shopping, departure' }
    ],
    category: 'family',
    rating: 4.8
  },
  {
    name: 'Egyptian Treasures',
    destination: 'Cairo & Luxor, Egypt',
    description: 'Discover ancient wonders with a tour of the Pyramids, Sphinx, and Valley of the Kings. Immerse yourself in thousands of years of history and culture.',
    price: 1099,
    duration: 7,
    maxPeople: 10,
    images: [
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a',
      'https://images.unsplash.com/photo-1539768942893-daf53e448371'
    ],
    includes: [
      'Round-trip flights',
      'Hotel accommodation',
      'All meals',
      'Pyramids entry tickets',
      'Nile River cruise',
      'Valley of the Kings tour',
      'Expert Egyptologist guide',
      'Camel ride at Giza'
    ],
    excludes: [
      'Inside pyramid entry',
      'Hot air balloon ride',
      'Travel insurance',
      'Personal shopping'
    ],
    itinerary: [
      { day: 1, title: 'Cairo Arrival', description: 'Arrive in Cairo, evening Nile dinner cruise' },
      { day: 2, title: 'Pyramids & Sphinx', description: 'Full day exploring Giza plateau, camel ride' },
      { day: 3, title: 'Egyptian Museum', description: 'Visit museum, see Tutankhamun treasures, Khan el-Khalili bazaar' },
      { day: 4, title: 'Fly to Luxor', description: 'Morning flight, check into cruise ship' },
      { day: 5, title: 'Valley of the Kings', description: 'Explore ancient tombs, Hatshepsut Temple' },
      { day: 6, title: 'Karnak & Luxor Temples', description: 'Visit massive temple complexes' },
      { day: 7, title: 'Return & Departure', description: 'Fly back to Cairo, departure' }
    ],
    category: 'cultural',
    rating: 4.9
  },
  {
    name: 'Budget Europe Backpacker',
    destination: 'Multi-City Europe',
    description: 'Affordable European adventure through 5 cities: Amsterdam, Berlin, Prague, Vienna, and Budapest. Perfect for young travelers and backpackers.',
    price: 699,
    duration: 10,
    maxPeople: 12,
    images: [
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a'
    ],
    includes: [
      'Inter-city train passes',
      'Hostel accommodation',
      'Free walking tours',
      'City maps and guides',
      'Welcome drinks in each city'
    ],
    excludes: [
      'Flights to/from Europe',
      'Meals',
      'Museum entries',
      'Travel insurance',
      'Additional activities'
    ],
    itinerary: [
      { day: 1-2, title: 'Amsterdam', description: 'Canal tour, Anne Frank House, nightlife' },
      { day: 3-4, title: 'Berlin', description: 'Berlin Wall, Brandenburg Gate, Museum Island' },
      { day: 5-6, title: 'Prague', description: 'Old Town Square, Castle, Charles Bridge' },
      { day: 7-8, title: 'Vienna', description: 'Schönbrunn Palace, coffee houses, opera' },
      { day: 9-10, title: 'Budapest', description: 'Parliament, thermal baths, ruin bars' }
    ],
    category: 'budget',
    rating: 4.5
  }
];

const seedData = async () => {
  try {
    // Clear existing packages
    await Package.deleteMany();
    console.log('Cleared existing packages');

    // Insert new packages
    await Package.insertMany(packages);
    console.log(`Inserted ${packages.length} packages`);

    console.log('Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
