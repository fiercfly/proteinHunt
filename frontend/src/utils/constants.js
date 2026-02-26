// ── Post types — classified by Groq from message content ────────────────────
// Every post from protein_deals1 is one of these, not a generic "category"
export const POST_TYPES = [
  { id: '',         label: 'All posts'   },
  { id: 'Deal',     label: 'Deals'       },
  { id: 'Restock',  label: 'Restocks'    },
  { id: 'PriceDrop',label: 'Price Drops' },
  { id: 'Review',   label: 'Reviews'     },
  { id: 'Freebie',  label: 'Freebies'    },
  { id: 'Update',   label: 'Updates'     },
];

// ── Protein brands we specifically track ────────────────────────────────────
export const BRANDS = [
  { id: '',                   label: 'All brands'        },
  { id: 'MuscleBlaze',        label: 'MuscleBlaze'       },
  { id: 'Optimum Nutrition',  label: 'Optimum Nutrition' },
  { id: 'MyProtein',          label: 'MyProtein'         },
  { id: 'GNC',                label: 'GNC'               },
  { id: 'Dymatize',           label: 'Dymatize'          },
  { id: 'Nakpro',             label: 'Nakpro'            },
  { id: 'BigMuscles',         label: 'BigMuscles'        },
  { id: 'AS-IT-IS',           label: 'AS-IT-IS'          },
  { id: 'Fast&Up',            label: 'Fast&Up'           },
  { id: 'MuscleTech',         label: 'MuscleTech'        },
];

// ── Sort options ─────────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { id: 'newest',   label: 'Newest first' },
  { id: 'votes',    label: 'Most upvoted' },
  { id: 'discount', label: 'Best discount'},
  { id: 'price',    label: 'Cheapest'     },
];

// ── Price ranges (in INR, relevant for supplements) ──────────────────────────
export const PRICE_RANGES = [
  { label: 'Any price',   max: '',     min: ''     },
  { label: 'Under ₹499',  max: '499',  min: ''     },
  { label: '₹500–₹999',   max: '999',  min: '500'  },
  { label: '₹1k–₹2k',     max: '2000', min: '1000' },
  { label: '₹2k–₹5k',     max: '5000', min: '2000' },
  { label: 'Over ₹5k',    max: '',     min: '5000' },
];

// ── Discount filter options ───────────────────────────────────────────────────
export const DISCOUNT_OPTIONS = [
  { id: '',   label: 'Any'  },
  { id: '10', label: '10%+' },
  { id: '20', label: '20%+' },
  { id: '30', label: '30%+' },
  { id: '50', label: '50%+' },
];

// For DealDetail breadcrumb lookup
export const CATEGORY_MAP = { Protein: { id: 'Protein', label: 'Protein & Supplements' } };