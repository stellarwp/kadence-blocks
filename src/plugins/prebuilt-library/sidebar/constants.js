import { __ } from '@wordpress/i18n';

const SIDEBAR_GROUPS = [
  {
    label: __( 'Patterns', 'kadence-blocks' ),
    icon: 'patternsIcon'
  },
  {
    label: __( 'The Events Calendar', 'kadence-blocks' ),
    icon: 'eventsCalendarIcon'
  },
  {
    label: __( 'GiveWP', 'kadence-blocks' ),
    icon: 'giveWpIcon'
  },
  {
    label: __( 'LearnDash', 'kadence-blocks' ),
    icon: 'learndashIcon'
  },
];

export const menuDesign = [
  {
    label: 'Patterns',
    icon: 'patternsIcon',
    options: [
      {
        value: 'all',
        label: 'All'
      },
      {
        value: 'hero',
        label: 'Hero'
      },
      {
        value: 'cards',
        label: 'Cards'
      },
      {
        value: 'columns',
        label: 'Columns'
      },
      {
        value: 'media-text',
        label: 'Media and Text'
      },
      {
        value: 'counter-or-stats',
        label: 'Counter or Stats'
      },
      {
        value: 'form',
        label: 'Form'
      },
      {
        value: 'gallery',
        label: 'Gallery'
      },
      {
        value: 'accordion',
        label: 'Accordion'
      },
      {
        value: 'image',
        label: 'Image'
      },
      {
        value: 'list',
        label: 'List'
      },
      {
        value: 'location',
        label: 'Location'
      },
      {
        value: 'logo-farm',
        label: 'Logo Farm'
      },
      {
        value: 'team',
        label: 'Team'
      },
      {
        value: 'post-loop',
        label: 'Post Loop'
      },
      {
        value: 'pricing-table',
        label: 'Pricing Table'
      },
      {
        value: 'slider',
        label: 'Slider'
      },
      {
        value: 'tabs',
        label: 'Tabs'
      },
      {
        value: 'testimonials',
        label: 'Testimonials'
      },
      {
        value: 'title-or-header',
        label: 'Title or Header'
      },
      {
        value: 'video',
        label: 'Video'
      }
    ],
  },
  {
    label: 'The Events Calendar',
    icon: 'eventsCalendarIcon',
    options: [
      {
        value: 'all',
        label: 'All'
      },
      {
        value: 'one',
        label: 'One'
      },
      {
        value: 'two',
        label: 'Two'
      }
    ]
  },
  {
    label: 'GiveWP',
    icon: 'giveWpIcon',
    options: [
      
    ]
  },
  {
    label: 'LearnDash',
    icon: 'learndashIcon',
    options: [
      {
        value: 'all',
        label: 'All'
      },
      {
        value: 'one',
        label: 'One'
      },
      {
        value: 'two',
        label: 'Two'
      }
    ]
  },
  {
    label: 'WooCommerce',
    icon: 'wooCommerceIcon',
    options: [
      {
        value: 'all',
        label: 'All'
      },
      {
        value: 'one',
        label: 'One'
      },
      {
        value: 'two',
        label: 'Two'
      },
      {
        value: 'three',
        label: 'Three'
      },
      {
        value: 'four',
        label: 'Four'
      },
      {
        value: 'five',
        label: 'Five'
      },
      {
        value: 'six',
        label: 'Six'
      },
      {
        value: 'seven',
        label: 'Seven'
      },
      {
        value: 'eight',
        label: 'Eight'
      },
      {
        value: 'nine',
        label: 'Nine'
      },
    ]
  }
];

const PATTERN_CONTEXTS = {
	'value-prop': __( 'Value Proposition', 'kadence-blocks' ),
	'products-services': __( 'Products or Services', 'kadence-blocks' ),
	'about': __( 'About', 'kadence-blocks' ),
	'achievements': __( 'Achievements', 'kadence-blocks' ),
	'call-to-action': __( 'Call to Action', 'kadence-blocks' ),
	'testimonials': __( 'Testimonials', 'kadence-blocks' ),
	'get-started': __( 'Get Started', 'kadence-blocks' ),
	'pricing-table': __( 'Pricing Table', 'kadence-blocks' ),
	'location': __( 'Location', 'kadence-blocks' ),
	'history': __( 'History', 'kadence-blocks' ),
	'mission': __( 'Mission', 'kadence-blocks' ),
	'profile': __( 'Profile', 'kadence-blocks' ),
	'team': __( 'Team', 'kadence-blocks' ),
	'work': __( 'Work', 'kadence-blocks' ),
	'faq': __( 'FAQ', 'kadence-blocks' ),
	'welcome': __( 'Welcome', 'kadence-blocks' ),
	'news': __( 'News', 'kadence-blocks' ),
	'blog': __( 'Blog', 'kadence-blocks' ),
	'contact-form': __( 'Contact', 'kadence-blocks' ),
	'subscribe-form': __( 'Subscribe', 'kadence-blocks' ),
	'careers': __( 'Careers', 'kadence-blocks' ),
	'donate': __( 'Donate', 'kadence-blocks' ),
	'events': __( 'Events', 'kadence-blocks' ),
	'partners': __( 'Partners', 'kadence-blocks' ),
	'industries': __( 'Industries', 'kadence-blocks' ),
	'volunteer': __( 'Volunteer', 'kadence-blocks' ),
	'support': __( 'Support', 'kadence-blocks' ),
};

export const menuDesignContext = [
  {
    label: 'Patterns',
    icon: 'patternsIcon',
    options: [ ...Object.keys( PATTERN_CONTEXTS ).map(( key ) => ({
      value: key,
      label: PATTERN_CONTEXTS[ key ]
    })) ]
  },
  {
    label: 'The Events Calendar',
    icon: 'eventsCalendarIcon',
    options: [
      {
        value: 'all',
        label: 'All'
      },
      {
        value: 'one',
        label: 'One'
      },
      {
        value: 'two',
        label: 'Two'
      }
    ]
  },
  {
    label: 'GiveWP',
    icon: 'giveWpIcon',
    options: [
      {
        value: 'all',
        label: 'All'
      },
      {
        value: 'one',
        label: 'One'
      },
      {
        value: 'two',
        label: 'Two'
      }
    ]
  },
  {
    label: 'LearnDash',
    icon: 'learndashIcon',
    options: [
      {
        value: 'all',
        label: 'All'
      },
      {
        value: 'one',
        label: 'One'
      },
      {
        value: 'two',
        label: 'Two'
      }
    ]
  },
  {
    label: 'WooCommerce',
    icon: 'wooCommerceIcon',
    options: [
      {
        value: 'all',
        label: 'All'
      },
      {
        value: 'one',
        label: 'One'
      },
      {
        value: 'two',
        label: 'Two'
      },
      {
        value: 'three',
        label: 'Three'
      },
      {
        value: 'four',
        label: 'Four'
      },
      {
        value: 'five',
        label: 'Five'
      },
      {
        value: 'six',
        label: 'Six'
      },
      {
        value: 'seven',
        label: 'Seven'
      },
      {
        value: 'eight',
        label: 'Eight'
      },
      {
        value: 'nine',
        label: 'Nine'
      },
    ]
  }
];

