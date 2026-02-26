dealapp/                          ← root folder (your project name)
│
├── backend/                      ← Express API server
│   ├── middleware/
│   │   └── auth.js               ← JWT + scraper secret verification
│   ├── models/
│   │   ├── Deal.js               ← MongoDB deal schema
│   │   └── User.js               ← MongoDB user schema
│   ├── routes/
│   │   ├── auth.js               ← /api/auth/* (login, register, me)
│   │   ├── deals.js              ← /api/deals/* (get, post, vote, submit)
│   │   └── users.js              ← /api/users/* (saved deals)
│   ├── .env.example              ← environment variable template
│   ├── package.json
│   └── server.js                 ← Express entry point
│
├── frontend/                     ← React app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── deals/
│   │   │   │   ├── DealCard.js       ← main deal card (the hero component)
│   │   │   │   ├── DealCard.css      ← card-specific styles
│   │   │   │   ├── DealFeed.js       ← infinite scroll feed
│   │   │   │   └── DealDetail.js     ← expanded single deal view
│   │   │   ├── layout/
│   │   │   │   ├── Header.js         ← sticky nav + search
│   │   │   │   ├── Sidebar.js        ← filters sidebar
│   │   │   │   └── Footer.js         ← simple footer
│   │   │   └── ui/
│   │   │       ├── Badge.js          ← discount/store/source badges
│   │   │       ├── Skeleton.js       ← loading skeletons
│   │   │       ├── Toast.js          ← notification system
│   │   │       ├── Ticker.js         ← live deal ticker strip
│   │   │       ├── SearchBar.js      ← search with suggestions
│   │   │       └── EmptyState.js     ← empty/error states
│   │   ├── hooks/
│   │   │   ├── useDeals.js           ← data fetching + infinite scroll
│   │   │   ├── useSearch.js          ← debounced search
│   │   │   ├── useFilters.js         ← filter state management
│   │   │   └── useLocalStorage.js    ← persist preferences
│   │   ├── pages/
│   │   │   ├── Home.js               ← main feed page
│   │   │   ├── DealPage.js           ← single deal page
│   │   │   ├── SavedDeals.js         ← user's saved deals
│   │   │   ├── SubmitDeal.js         ← community submission form
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── store/
│   │   │   └── authStore.js          ← Zustand global auth state
│   │   ├── styles/
│   │   │   ├── global.css            ← design tokens + base styles
│   │   │   ├── animations.css        ← all keyframes + transitions
│   │   │   └── utilities.css         ← helper classes
│   │   ├── utils/
│   │   │   ├── api.js                ← axios instance + all API calls
│   │   │   ├── helpers.js            ← formatPrice, timeAgo, etc.
│   │   │   └── constants.js          ← categories, stores, colors
│   │   ├── App.js                    ← root component + routing
│   │   └── index.js                  ← React entry point
│   ├── .env.example
│   └── package.json
│
├── scraper/                      ← Deal scraper (Node.js)
│   ├── index.js                  ← entry — boots all scrapers
│   ├── telegram.js               ← Telegram MTProto listener
│   ├── reddit.js                 ← Reddit polling loop
│   ├── parser.js                 ← zero-dependency regex parser
│   ├── apiClient.js              ← posts deals to backend
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md                     ← setup instructions
└── DEPLOY.md                     ← step-by-step deployment guide