/* ─── SiteConfig Singleton ───────────────────────────────────────────────── */
/* Central config object — one import gives you the whole site identity.     */

export interface SocialLink {
  platform: string
  url: string
  ariaLabel: string
}

/* All newspaper-conceit chrome lives here: nameplate, folios, edition labels,
   and colophon copy. Components render these values — never hardcode them.   */
export interface PaperSection {
  id: string           // DOM id the section anchors to, e.g. 'featured'
  folio: string        // page mark, e.g. 'A1'
  label: string        // section name as printed, e.g. 'Front Page'
  bannerLabel?: string // longer form for the section banner, e.g. 'Letters & Colophon'
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
  colophon: string
  publisher: { heading: string; note: string }
  channels: { heading: string; routes: { label: string; platform: string }[] }
  letters: { heading: string; note: string }
  article: {
    relatedHeading: string
    externalCta: string
    defaultBackLabel: string
    notFound: { kicker: string; headline: string }
  }
  archive: {
    note: string
    headline: string
    standfirst: string
  }
  hero: {
    kicker: string
    indexHeading: string
    foldNote: string
    foldCta: string
  }
  cta: {
    leadStory: string
    read: string
    minRead: string // read-time noun printed after the minute count
    showAll: string
    showLess: string
  }
  stopPress: {
    label: string
    separator: string
    ariaLabel: string
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
  experienceBadge: string
  map: {
    folio: string
    label: string
    counterNoun: string
    filters: { all: string; linked: string }
    loading: string
    back: string
    backToMap: string
    related: { one: string; many: string }
    photoCreditLabel: string
    refer: { body: string; cta: string }
  }
}

export interface SiteConfigProps {
  name: string
  title: string
  employer: string
  tagline: string
  lede: string[]
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
    'Before Bullish he was at Morgan Stanley, where he built risk systems for front-office trading teams.',
    'His work has spanned Sri Lanka, Hong Kong, and the United States, mostly in Java and Python: distributed systems, automation, and the reliability work that keeps them running.',
    'He also mentors junior engineers and writes about the systems he builds.',
  ],
  bio:      'On the distributed-systems beat since 2015.',
  location: 'Hong Kong',
  email:    'dulangajay@gmail.com',
  socials: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/dulangaj', ariaLabel: 'LinkedIn profile' },
    { platform: 'GitHub',   url: 'https://github.com/dulangaj',      ariaLabel: 'GitHub profile'   },
    { platform: 'Email',    url: 'mailto:dulangajay@gmail.com',       ariaLabel: 'Send email'       },
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
      { id: 'featured',   folio: 'A1', label: 'Front Page', note: 'The lead story' },
      {
        id: 'experience', folio: 'A2', label: 'Experience', note: 'The record',
        headline:   'Where the work was done.',
        standfirst: 'Experience across finance, retail tech, and product engineering, with a focus on reliability, clear communication, and mentoring.',
      },
      {
        id: 'writing', folio: 'A3', label: 'Writing', note: 'The inside pages',
        headline:   'Notes from the field.',
        standfirst: 'Build notes, research breakdowns, and reflections on engineering, teamwork, and learning in public.',
      },
      {
        id: 'contact', folio: 'Z', label: 'Letters',
        bannerLabel: 'Letters & Colophon', note: 'The back page',
      },
    ],
    articleFolio: 'B',
    colophon:
      'Set in Playfair Display, Source Serif 4, Inter, and JetBrains Mono. Built with React and Tailwind; hosted on GitHub Pages.',
    publisher: {
      heading: 'The Publisher',
      note:
        'The Jayawardena Herald is the personal site of Dulanga Jayawardena, a software engineer at Bullish in Hong Kong, formerly of Morgan Stanley.',
    },
    channels: {
      heading: 'Address the Editor',
      routes: [
        { label: 'By Cable', platform: 'LinkedIn' },
        { label: 'By Wire',  platform: 'GitHub'   },
        { label: 'By Post',  platform: 'Email'    },
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
      defaultBackLabel: 'Front Page',
      notFound: { kicker: '404', headline: 'Post not found.' },
    },
    archive: {
      note:       'The archive',
      headline:   'Articles, project notes, and field notes.',
      standfirst: 'A complete index of long-form writing on the site. One permanent URL per article.',
    },
    hero: {
      kicker:       'Front Page Profile',
      indexHeading: 'Inside this Issue',
      foldNote:     'Below the fold',
      foldCta:      'Continued on Front Page',
    },
    cta: {
      leadStory: 'Continued inside',
      read:      'Read',
      minRead:   'min read',
      showAll:   'Show all',
      showLess:  'Show less',
    },
    stopPress: {
      label:       'Stop Press',
      separator:   '†',
      ariaLabel:   'Late bulletins',
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
    experienceBadge: 'Now',
    map: {
      folio:       'C',
      label:       'Datelines',
      counterNoun: 'dispatches',
      filters:     { all: 'All', linked: 'Articles' },
      loading:     'Loading map',
      back:        'Back',
      backToMap:   'Back to map',
      related:     { one: 'Related Article', many: 'Related Articles' },
      photoCreditLabel: 'Photo',
      refer: {
        body: 'Photographs and field notes from the road, plotted where they happened.',
        cta:  'Turn to Section',
      },
    },
  },
})
