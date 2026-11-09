/*
 * Everything about the wedding lives in this one file.
 * Change a value here and the whole invite follows.
 * Dates use Indian time. The date cards, hearts and calendar links are all worked out from them.
 */
export const wedding = {
  bride: 'Parita',
  groom: 'Deep',
  weddingAt: '2026-11-24T19:45:00+05:30',

  // To change the song, add it to public/music under a new name and point this at it.
  music: { file: 'music/sahiba.mp3', volume: 0.6 },

  // The first screen a guest sees, before they press Open Invitation.
  opening: {
    line: 'You are warmly invited',
    note: 'Kartak Sud Poonam, Samvat 2083. Please join us for the wedding on Tuesday, 24 November 2026, at Dreamland Party Plot in Rajkot.'
  },

  blessing: {
    shloka: ['વક્રતુણ્ડ મહાકાય સૂર્યકોટિ સમપ્રભ ।', 'નિર્વિઘ્નં કુરુ મે દેવ સર્વકાર્યેષુ સર્વદા ॥'],
    brideParents: 'Smt. Seemaben & Shri Ketanbhai Gajera',
    invite: 'With the blessings of our elders, we joyfully invite you to the wedding of our dear daughter',
    groomLabel: 'Beloved son of',
    groomParents: ['Smt. Bhavnaben &', 'Shri Ashokbhai Kotadiya']
  },

  date: {
    eyebrow: 'THE AUSPICIOUS DATE',
    hint: 'Scratch the hearts to reveal the date',
    note: 'Kartak Sud Poonam, Samvat 2083. Please keep this full moon day free and celebrate with us.'
  },

  meet: {
    title: ['Meet the', 'Bride & Groom'],
    words:
      "We joyfully invite you to witness Parita and Deep's seven vows of togetherness. Come bless the couple and make this day one to remember."
  },

  celebrations: {
    title: 'Our Celebrations',
    sub: 'We would love to celebrate each one with you'
  },

  venue: {
    name: 'Dreamland Party Plot',
    address: "Section B, opposite Asharam Bapu's Ashram, Nyari Dam Area, Rajkot",
    map: 'https://maps.app.goo.gl/jUpAzVYfySr2DNsH6',
    covers: 'All five functions'
  },

  // A function held somewhere else can carry its own `venue` with the same fields as above.
  events: [
    { name: 'Mandap Muhurat', start: '2026-11-23T14:00:00+05:30', minutes: 60 },
    { name: 'Haldi Rasam', start: '2026-11-23T17:00:00+05:30', minutes: 60 },
    { name: 'Jaan Aagman', start: '2026-11-24T17:00:00+05:30', minutes: 60 },
    { name: 'Wedding Dinner', start: '2026-11-24T19:30:00+05:30', minutes: 120 },
    { name: 'Hast Melap', start: '2026-11-24T19:45:00+05:30', minutes: 90 }
  ],

  welcome: 'We look forward to welcoming you',

  rsvp: {
    title: 'Please let us know you are coming',
    notePlaceholder: 'Write a wish or a blessing for the couple',
    send: 'Send Your Wishes',
    // The Web app address from google-sheet/SETUP.md. Replies are saved to your Google Sheet.
    // While this is empty, replies go through WhatsApp instead.
    sheetUrl: 'https://script.google.com/macros/s/AKfycbzLW8cpYUkLRkO_BbpxhyqXymZWz2wbcq6JZ77xBtsJEWrbxWnSX3z8xG0UpUR6Qkue/exec',
    // Replies open in WhatsApp, addressed to this number.
    whatsapp: '919409681405',
    contact: { name: 'Rakshit Gajera', role: "Bride's Brother", phone: '+919409681405' }
  },

  countdown: {
    title: 'Counting down to our big day',
    doneTitle: 'The big day is here!',
    sub: 'Our families cannot wait to share this happy day with you',
    closing: ['WITH LOVE FROM THE', 'GAJERA AND KOTADIYA', 'FAMILIES']
  }
};
