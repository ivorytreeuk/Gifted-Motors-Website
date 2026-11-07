/* site-data.js = everything you may want to change later, in one place. No coding skills needed:
   change the words between the quote marks, save, and the website updates. */

// The Google script address (the same one the staff portal uses). Booking requests are sent here and land on the
// "Booking requests" tab of the Google Sheet.
const API_URL = 'https://script.google.com/macros/s/AKfycbwk3i5xXCIqEuQ8OrSenIXnuVpMjS9R98YCzFPD83pXpIghozSnSI4vtYKMamZi0Ef_/exec';

const SITE = {
  name: 'Gifted Motors',
  tagline: 'Need a car? Gifted Motors got you covered.',
  phone: '+260 975 227 125',
  phoneLink: '260975227125',          // the same number with no + or spaces (used for call and WhatsApp links)
  whatsapp: true,                      // set to false if this number is not on WhatsApp
  address: 'Woodlands, Zambia',
  email: 'giftedmotors98@gmail.com',
  hours: [['Monday to Saturday', '08:00 to 17:00'], ['Sunday', 'By appointment']],
  assistance: 'For 24 hours assistance, feel free to call.',

  // Paste each social media link between the quotes. Empty ones are hidden automatically.
  social: {
    facebook: 'https://www.facebook.com/share/19kdvxnm6g/',
    instagram: 'https://www.instagram.com/gifted_motors_zm',
    tiktok: 'https://www.tiktok.com/@gifted.motors',
    whatsappChannel: '',
    youtube: '',
    x: ''
  },

  // The Airtel Money number customers pay to. Leave empty until it is decided: the site then says
  // that we will send payment details when the booking is confirmed.
  airtelNumber: '',
  airtelName: ''
};

// The cars. "rate" is the price per day in Kwacha. Leave it empty ('') to show "Ask for the rate".
// "photo" is the picture file inside the img folder. Replace the file (same name) with a real photo to update it.
const FLEET = [
  { id: 'prado',   name: 'Toyota Land Cruiser Prado', kind: 'SUV',          seats: '7 seats', note: 'Comfortable and strong on any road. Ideal for families and long trips.', rate: '', photo: 'img/prado.jpg' },
  { id: 'hilux',   name: 'Toyota Hilux',              kind: 'Pick-up',      seats: '5 seats', note: 'Double-cab pick-up built for rough roads and heavy loads.',            rate: '', photo: 'img/hilux.jpg' },
  { id: 'alphard', name: 'Toyota Alphard / Vellfire', kind: 'Luxury van',   seats: '7 seats', note: 'Smooth, spacious and stylish. Great for airport pick-ups and events.',  rate: '', photo: 'img/alphard.jpg' },
  { id: 'fit',     name: 'Honda Fit',                 kind: 'Compact car',  seats: '5 seats', note: 'Easy to drive, easy to park and light on fuel. Perfect for the city.',   rate: '', photo: 'img/fit-silver.jpg' },
  { id: 'hiace',   name: 'Toyota Hiace van',          kind: 'Minibus',      seats: 'Group travel', note: 'Room for the whole group and the luggage.',                         rate: '', photo: '' }
];

// Deals shown on the website. Add, remove or edit lines. Leave the list empty ([]) to hide the section.
const DEALS = [
  { title: 'Weekly and long hire',       text: 'Hiring for a week or more? Call us and we will agree a rate with you.' },
  { title: 'Pay before you collect',     text: 'Pay in advance by Airtel Money and your vehicle is reserved and ready when you arrive.' },
  { title: 'Buying or importing a car?', text: 'We handle import, port clearance, border clearance and registration, so you do not have to.' }
];

// The services from the flyer.
const SERVICES = [
  { title: 'Vehicle hire',               text: 'Cars, SUVs, pick-ups and vans for a day, a week or longer.',      icon: 'key' },
  { title: 'Airport pickups',            text: 'Arrive and find your ride waiting.',                               icon: 'plane' },
  { title: 'Imports',                    text: 'New and used vehicles brought into Zambia for you.',               icon: 'ship' },
  { title: 'Port and border clearance',  text: 'Clearing and forwarding, including the Nakonde border.',          icon: 'box' },
  { title: 'Vehicle registration',       text: 'Plates and registration done properly and on time.',               icon: 'card' },
  { title: 'Buying and selling',         text: 'Motor vehicles bought and sold. Talk to us first.',                icon: 'tag' },
  { title: 'Accessories and spares',     text: 'Universal car accessories and Honda Fit spares.',                  icon: 'wrench' }
];

// Coming soon. These show as "Coming soon" and cannot be booked yet.
const SOON = [
  { title: 'Corporate bookings',   text: 'Monthly accounts and invoices for companies and organisations.' },
  { title: 'Long-term hire',       text: 'Monthly and yearly vehicle plans.' },
  { title: 'Online card payments', text: 'Pay by card on the website.' }
];

// Recently sold. Add a line for each sold car. "baked: true" means the photo already has "Sold" written on it.
const SOLD = [
  { name: 'Honda Fit', note: 'Sold',  photo: 'img/sold-fit-brown.jpg', baked: true },
  { name: 'Honda Fit', note: 'Sold',  photo: 'img/sold-fit-gold.jpg',  baked: true },
  { name: 'Honda Fit', note: 'Sold',  photo: 'img/sold-fit-blue.jpg',  baked: false },
  { name: 'Honda Fit', note: 'Sold',  photo: 'img/sold-fit-black.jpg', baked: false }
];

// Awards and recognition shown on the Reviews page.
const ACCOLADES = [
  {
    title: 'Outstanding Customer Award',
    from: 'SBT Co., Ltd',
    date: 'Presented 1 February 2026 for Fiscal Year 2025',
    text: 'GIFTED MOTORS is truly honoured and grateful to receive the Outstanding Customer Award from SBT.\n\nThis recognition means a lot to us and motivates us to continue striving for excellence, building strong relationships, and delivering the best service to our valued customers.\n\nA big thank you to SBT for this recognition and for appreciating our commitment. We look forward to strengthening our partnership and achieving even greater milestones together.\n\nGIFTED MOTORS: Driven by Excellence!',
    source: 'From the Gifted Motors Facebook page, 9 October',
    photos: [
      { src: 'img/award-certificate.jpg', alt: 'The Outstanding Customer Award certificate presented to Gifted Motors by SBT Co., Ltd' },
      { src: 'img/award-handover.jpg', alt: 'The owner of Gifted Motors receiving the award from the SBT representative' },
      { src: 'img/award-group.jpg', alt: 'The owner of Gifted Motors with the SBT representative and a colleague at the Gifted Motors office' }
    ]
  }
];

/* Gallery: videos play muted, one after another, in a loop. Files are in /media */
const GALLERY = {
  videos: [1,2,3,4,5,6,7,8,9,10].map(n => ({ src: 'media/clip' + n + '.mp4', poster: 'media/clip' + n + '.jpg' })),
  photos: [{ src: 'img/fit-black-livery.jpg', alt: 'Black Honda Fit with Gifted Motors branding' }]
};
