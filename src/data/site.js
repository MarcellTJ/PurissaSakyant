export const whatsappUrl =
  'whatsapp://send?phone=628991778888&text=Halo%20saya%20mau%20booking%20Sakyant%20Event.%20Bisa%20dibantu%20proses%20nya%3F/';
export const navigation = [
  { to: '/', label: 'Beranda' },
  { to: '/sak-yant', label: 'Sak Yant & Blessing' },
  { to: '/gallery', label: 'Galeri' },
  { to: '/events', label: 'Event' },
  { to: '/faq', label: 'FAQ' },
  { to: '/socials', label: 'Socials' },
];
export const eventList = [
  {
    id: 'next',
    to: '/events',
    eyebrow: 'JADWAL',
    date: 'Berikutnya',
    status: 'INFORMASI & BOOKING',
    title: 'Sak Yant & Blessing Purissa',
    description:
      'Hubungi tim untuk tanggal, ketersediaan sesi, dan detail kunjungan.',
  },
  {
    id: '2025',
    to: '/events#events',
    eyebrow: '05–07 DES',
    date: '2025',
    status: 'EVENT SEBELUMNYA',
    title: 'Special Big Sakyant Event',
    description:
      'Sak Yant & Blessing Saney bersama Ajahn Fhuk · Jakarta Barat.',
    past: true,
  },
];

// Add an email address here when ready. Until then email sending stays disabled.
export const contact = {
  email: null,
  socialProfiles: [
    {
      name: 'Instagram',
      handle: '@purissasakyant_jakarta',
      url: 'https://www.instagram.com/purissasakyant_jakarta/',
    },
    {
      name: 'TikTok',
      handle: '@purissa.sakyant.jakarta',
      url: 'https://www.tiktok.com/@purissa.sakyant.jakarta',
    },
  ],
};
