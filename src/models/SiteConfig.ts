/* ─── SiteConfig Singleton ───────────────────────────────────────────────── */
/* Central config object — one import gives you the whole site identity.     */

export interface SocialLink {
  platform: string
  url: string
  ariaLabel: string
}

/* All newspaper-conceit chrome lives here: nameplate, folios, edition labels,
   and back-page copy. Components render these values — never hardcode them.   */
export interface PaperSection {
  id: string           // DOM id the section anchors to, e.g. 'featured'
  folio: string        // page mark, e.g. 'A1'
  label: string        // name in the front-page index, e.g. 'About'
  bannerLabel?: string // name on the section banner when it differs, e.g. 'Front Page'
  note?: string        // right-hand banner annotation, e.g. 'The lead story'
  headline?: string    // section headline printed under the banner
  standfirst?: string  // one-line intro under the headline
}

export interface PaperEdition {
  name: string // full form, e.g. 'Morning Edition'
  abbr: string // toggle form, e.g. 'Morn.'
}

export interface PaperConfig {
  name: string
  motto: string
  established: number
  bureau: string
  price: string
  fleuron: string // printer's ornament used in banners and tombstones
  dateLocale: string // house style for every printed date
  editions: { light: PaperEdition; dark: PaperEdition }
  sections: PaperSection[]
  articleFolio: string
  publisher: { heading: string; note: string }
  channels: { heading: string; routes: { label: string; platform: string }[] }
  letters: { heading: string; note: string }
  nav: { label: string; links: { label: string; to: string }[] }
  article: {
    relatedHeading: string
    externalCta: string
    defaultBackLabel: string
    notFound: { kicker: string; headline: string; email: string }
    dateline: { dash: string }
    measure: { separator: string; minutes: string }
    index: { heading: string; minHeadings: number }
  }
  archive: {
    note: string
    headline: string
    standfirst: string
  }
  masthead: {
    extraLabel: string    // stamp printed beside the nameplate on a fresh issue
    extraWithinDays: number // how recent the newest post must be to earn it
  }
  hero: {
    kicker: string
    indexHeading: string
    foldNote: string
    foldCta: string
    portraitAlt: string
    emailCta: string
    careerHeading: string
  }
  cta: {
    leadStory: string
    read: string
    minRead: string // read-time noun printed after the minute count
    allPosts: string // '{count}' is replaced with the total post count
  }
  stopPress: {
    label: string
    separator: string
    ariaLabel: string
    pauseLabel: string
    scrollLabel: string
    loopSeconds: number
    /* Wire feeds — every feed is one file in the gist at feedBase, fetched
       once after load. Each file serves { updated: <ISO-8601>, items:
       [{ label, value }] }. A feed whose `updated` stamp is missing or older
       than its maxAgeHours is ignored wholesale — stale wires don't print.
       Fresh items replace fallback bulletins with the same label; new labels
       append at the end. */
    feedBase: string
    feeds: { file: string; maxAgeHours: number }[]
  }
  map: {
    folio: string
    label: string
    counterNoun: string
    filters: { all: string; linked: string }
    loading: string
    backToMap: string
    related: { one: string; many: string }
    photoCreditLabel: string
    refer: { body: string; cta: string }
    tiles: { light: string; dark: string; attribution: string }
  }
}

export interface CareerEntry {
  org: string
  role: string
  years: string
}

export interface SiteConfigProps {
  name: string
  title: string
  employer: string
  tagline: string
  lede: string[]
  career: CareerEntry[]
  bio: string
  location: string
  email: string
  socials: SocialLink[]
  paper: PaperConfig
}

class SiteConfigClass {
  readonly name:     string
  readonly title:    string
  readonly employer: string
  readonly tagline:  string
  readonly lede:     string[]
  readonly career:   CareerEntry[]
  readonly bio:      string
  readonly location: string
  readonly email:    string
  readonly socials:  SocialLink[]
  readonly paper:    PaperConfig

  constructor(props: SiteConfigProps) {
    this.name     = props.name
    this.title    = props.title
    this.employer = props.employer
    this.tagline  = props.tagline
    this.lede     = props.lede
    this.career   = props.career
    this.bio      = props.bio
    this.location = props.location
    this.email    = props.email
    this.socials  = props.socials
    this.paper    = props.paper
  }

  get initials(): string {
    return this.name
      .split(' ')
      .map((w) => w[0])
      .join('')
  }

  get mailtoLink(): string {
    return `mailto:${this.email}`
  }
}

/* ─── Singleton Instance ─────────────────────────────────────────────────── */

export const SiteConfig = new SiteConfigClass({
  name:     'Dulanga Jayawardena',
  title:    'Software Engineer',
  employer: 'Bullish',
  tagline:  'Software engineer building risk and trading systems in finance.',
  lede: [
    'He has worked in Sri Lanka, Hong Kong, and the United States, mostly in Java and Python, on distributed systems and the automation that keeps them running.',
    'He also mentors junior engineers and writes about the systems he builds.',
  ],
  career: [
    { org: 'Bullish',        role: 'Software Engineer',       years: '2025–Present' },
    { org: 'Morgan Stanley', role: 'Risk Systems Developer',  years: '2021–2025' },
    { org: 'CUHK',           role: 'BEng, Systems Engineering', years: '2016–2020' },
  ],
  bio:      'On the distributed-systems beat since 2015.',
  location: 'Hong Kong',
  email:    'hello@dulangaj.com',
  socials: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/dulangaj', ariaLabel: 'LinkedIn profile' },
    { platform: 'GitHub',   url: 'https://github.com/dulangaj',      ariaLabel: 'GitHub profile'   },
    { platform: 'Email',    url: 'mailto:hello@dulangaj.com',       ariaLabel: 'Send email'       },
  ],
  paper: {
    name:        'The Jayawardena Herald',
    motto:       '“All the work that’s fit to ship.”',
    established: 2015,
    bureau:      'Hong Kong Bureau',
    price:       'Price: Free',
    fleuron:     '❦',
    dateLocale:  'en-GB',
    editions: {
      light: { name: 'Morning Edition', abbr: 'Morn.' },
      dark:  { name: 'Evening Edition', abbr: 'Eve.'  },
    },
    sections: [
      { id: 'featured',   folio: 'A1', label: 'About', bannerLabel: 'Front Page', note: 'The lead story' },
      {
        id: 'writing', folio: 'A2', label: 'Writing', note: 'The inside pages',
        headline:   'Notes from the field.',
        standfirst: 'Older projects and school notes.',
      },
      {
        id: 'contact', folio: 'Z', label: 'Contact',
        bannerLabel: 'Letters', note: 'The back page',
      },
    ],
    articleFolio: 'B',
    publisher: {
      heading: 'The Publisher',
      note:
        'The Jayawardena Herald is the personal site of Dulanga Jayawardena, a software engineer at Bullish in Hong Kong, formerly of Morgan Stanley.',
    },
    channels: {
      heading: 'Contact',
      routes: [
        { label: 'By Cable', platform: 'LinkedIn' },
        { label: 'By Wire',  platform: 'GitHub'   },
        { label: 'By Post',  platform: 'Email'    },
      ],
    },
    nav: {
      label: 'Sections',
      links: [
        { label: 'Home',    to: '/' },
        { label: 'Writing', to: '/writing/' },
        { label: 'Photos',  to: '/map/' },
      ],
    },
    letters: {
      heading: 'Letters to the Editor',
      note:
        'No letters were received in time for this edition. Corrections, introductions, and offers of employment will all be printed with gratitude.',
    },
    article: {
      relatedHeading:   'Related writing',
      externalCta:      'View the full project',
      defaultBackLabel: 'Home',
      notFound: { kicker: '404', headline: 'Page not found.', email: 'Email' },
      dateline: { dash: '—' },
      measure: { separator: '·', minutes: 'min' },
      index: { heading: 'In this article', minHeadings: 3 },
    },
    archive: {
      note:       'The archive',
      headline:   'Everything filed to date.',
      standfirst: 'Every long-form article on the site, newest first, each at a permanent URL.',
    },
    masthead: {
      extraLabel:      'Extra',
      extraWithinDays: 14,
    },
    hero: {
      kicker:       'Profile',
      indexHeading: 'Inside this Issue',
      foldNote:     'Below the fold',
      foldCta:      'Continued on Front Page',
      portraitAlt:  'Portrait of Dulanga Jayawardena, a software engineer based in Hong Kong',
      emailCta:     'Email me',
      careerHeading: 'Career',
    },
    cta: {
      leadStory: 'Read the story',
      read:      'Read',
      minRead:   'min read',
      allPosts:  'All {count} posts',
    },
    stopPress: {
      label:       'Stop Press',
      separator:   '†',
      ariaLabel:   'Late bulletins',
      pauseLabel:  'Pause',
      scrollLabel: 'Bulletins, scroll with arrow keys',
      loopSeconds: 40,
      /* SHA-less /raw base always serves each file's latest revision. */
      feedBase: 'https://gist.githubusercontent.com/dulangaj/d5da4363ee11ec57a3fb3f775379dbb7/raw',
      /* Weather goes stale fast (12h); a "working on" feed might carry
         maxAgeHours: 720 (30 days). */
      feeds: [
        { file: 'weather.json',    maxAgeHours: 12 },
        { file: 'working-on.json', maxAgeHours: 720 },
      ],
    },
    map: {
      folio:       'C',
      label:       'Photos',
      counterNoun: 'dispatches',
      filters:     { all: 'All', linked: 'Articles' },
      loading:     'Loading map',
      backToMap:   'Back to map',
      related:     { one: 'Related Article', many: 'Related Articles' },
      photoCreditLabel: 'Photo',
      refer: {
        body: 'Photographs and field notes from the road, plotted where they happened.',
        cta:  'Turn to Section',
      },
      tiles: {
        light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        dark:  'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    },
  },
})
