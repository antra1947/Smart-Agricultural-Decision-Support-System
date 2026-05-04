import React, { useState, useEffect } from 'react';
import { Search, MapPin, Tag, Plus, X, Phone, MessageSquare, Star, Filter, ChevronDown } from 'lucide-react';

// Strips non-digits from phone and builds WhatsApp links
const toWANumber = (phone) => '91' + phone.replace(/\D/g, '').slice(-10);
const waMessageLink = (phone, msg) => `https://wa.me/${toWANumber(phone)}?text=${encodeURIComponent(msg)}`;
const waCallLink = (phone) => `https://wa.me/${toWANumber(phone)}`;

const INITIAL_LISTINGS = [
  { id: 1, crop: "Organic Wheat", price: 2200, unit: "Qtl", quantity: "50 Qtl", location: "Punjab, India", farmer: "Raj Singh", phone: "98765-43210", image: "🌾", category: "Grains", rating: 4.8, reviews: 24 },
  { id: 2, crop: "Mustard Seeds", price: 4800, unit: "Qtl", quantity: "20 Qtl", location: "Rajasthan, India", farmer: "Amit Kumar", phone: "87654-32109", image: "🌼", category: "Oilseeds", rating: 4.5, reviews: 18 },
  { id: 3, crop: "Soybean", price: 3900, unit: "Qtl", quantity: "35 Qtl", location: "Madhya Pradesh", farmer: "Suresh Patel", phone: "76543-21098", image: "🌱", category: "Pulses", rating: 4.7, reviews: 31 },
  { id: 4, crop: "Basmati Rice", price: 3100, unit: "Qtl", quantity: "100 Qtl", location: "Haryana, India", farmer: "Balbir Singh", phone: "65432-10987", image: "🍚", category: "Grains", rating: 4.9, reviews: 56 },
  { id: 5, crop: "Turmeric", price: 8500, unit: "Qtl", quantity: "15 Qtl", location: "Maharashtra, India", farmer: "Ramesh Desai", phone: "54321-09876", image: "🟡", category: "Spices", rating: 4.6, reviews: 12 },
  { id: 6, crop: "Red Chilli", price: 12000, unit: "Qtl", quantity: "8 Qtl", location: "Andhra Pradesh", farmer: "Venkat Rao", phone: "43210-98765", image: "🌶️", category: "Spices", rating: 4.4, reviews: 9 },
  { id: 7, crop: "Cotton", price: 6200, unit: "Qtl", quantity: "200 Qtl", location: "Gujarat, India", farmer: "Dhruv Shah", phone: "32109-87654", image: "🌿", category: "Fiber", rating: 4.3, reviews: 41 },
  { id: 8, crop: "Sugarcane", price: 350, unit: "Ton", quantity: "500 Ton", location: "Uttar Pradesh", farmer: "Mohan Yadav", phone: "21098-76543", image: "🎋", category: "Cash Crops", rating: 4.2, reviews: 67 },
  { id: 9, crop: "Tomato", price: 1800, unit: "Qtl", quantity: "30 Qtl", location: "Karnataka, India", farmer: "Prakash Gowda", phone: "10987-65432", image: "🍅", category: "Vegetables", rating: 4.7, reviews: 22 },
  { id: 10, crop: "Onion", price: 2400, unit: "Qtl", quantity: "75 Qtl", location: "Maharashtra, India", farmer: "Sanjay Patil", phone: "98760-12345", image: "🧅", category: "Vegetables", rating: 4.5, reviews: 38 },
  { id: 11, crop: "Maize (Corn)", price: 1950, unit: "Qtl", quantity: "120 Qtl", location: "Bihar, India", farmer: "Rajan Mishra", phone: "87651-23456", image: "🌽", category: "Grains", rating: 4.6, reviews: 15 },
  { id: 12, crop: "Groundnut", price: 5600, unit: "Qtl", quantity: "40 Qtl", location: "Rajasthan, India", farmer: "Kishan Lal", phone: "76542-34567", image: "🥜", category: "Oilseeds", rating: 4.8, reviews: 29 },
];

const CATEGORIES = ["All", "Grains", "Pulses", "Oilseeds", "Spices", "Vegetables", "Cash Crops", "Fiber"];

const ContactModal = ({ listing, onClose }) => {
  const [msg, setMsg] = useState(`Hi ${listing.farmer}, I'm interested in buying your ${listing.crop} listed at ₹${listing.price}/${listing.unit}. Please contact me.`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Contact Seller</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 bg-green-50 rounded-xl p-4">
            <div className="text-4xl">{listing.image}</div>
            <div>
              <h3 className="font-bold text-slate-800">{listing.crop}</h3>
              <p className="text-green-700 font-semibold">₹{listing.price.toLocaleString()}/{listing.unit}</p>
              <p className="text-sm text-slate-500">{listing.location}</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-500 mb-1">Seller</p>
            <p className="font-semibold text-slate-800">{listing.farmer}</p>
            <div className="flex items-center gap-2 mt-2">
              <Phone size={16} className="text-green-600" />
              <span className="text-green-700 font-medium">{listing.phone}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Message</label>
            <textarea
              rows={3}
              value={msg}
              onChange={e => setMsg(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* WhatsApp buttons — work on desktop and mobile */}
          <div className="flex gap-3">
            <a
              href={waMessageLink(listing.phone, msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Message
            </a>
            <a
              href={waCallLink(listing.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 hover:bg-green-50 px-4 py-3 rounded-xl font-semibold transition"
              title="WhatsApp Call"
            >
              <Phone size={18} />
            </a>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Opens WhatsApp — works on desktop and mobile
          </p>
        </div>
      </div>
    </div>
  );
};

const NewListingModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ crop: '', price: '', unit: 'Qtl', quantity: '', location: '', phone: '', category: 'Grains' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const icons = { Grains: '🌾', Pulses: '🌿', Oilseeds: '🌻', Spices: '🌶️', Vegetables: '🥦', 'Cash Crops': '🎋', Fiber: '🌿' };
    onAdd({
      id: Date.now(),
      crop: form.crop,
      price: parseInt(form.price),
      unit: form.unit,
      quantity: `${form.quantity} ${form.unit}`,
      location: form.location,
      farmer: 'You',
      phone: form.phone,
      image: icons[form.category] || '🌱',
      category: form.category,
      rating: 5.0,
      reviews: 0,
    });
    setSubmitted(true);
  };

  const fields = [
    { label: 'Crop Name', key: 'crop', type: 'text', placeholder: 'e.g. Organic Wheat' },
    { label: 'Price (₹)', key: 'price', type: 'number', placeholder: 'e.g. 2200' },
    { label: 'Quantity', key: 'quantity', type: 'number', placeholder: 'e.g. 50' },
    { label: 'Location', key: 'location', type: 'text', placeholder: 'e.g. Punjab, India' },
    { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: 'e.g. 98765-43210' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">Create New Listing</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
        </div>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                <input
                  type={f.type}
                  required
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                  {['Qtl', 'Ton', 'Kg', 'Bag'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition mt-2">
              Publish Listing
            </button>
          </form>
        ) : (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Listing Published!</h3>
            <p className="text-slate-500 mb-6">Your crop is now visible to buyers across India.</p>
            <button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={12} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
    ))}
    <span className="text-xs text-slate-500 ml-1">{rating.toFixed(1)}</span>
  </div>
);

const Marketplace = () => {
  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem('smartcrop_listings');
      return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  // Persist to localStorage whenever listings change
  useEffect(() => {
    localStorage.setItem('smartcrop_listings', JSON.stringify(listings));
  }, [listings]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [contactListing, setContactListing] = useState(null);
  const [showNewListing, setShowNewListing] = useState(false);

  const filtered = listings
    .filter(l => l.crop.toLowerCase().includes(searchTerm.toLowerCase()) || l.location.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(l => selectedCategory === 'All' || l.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="space-y-6">
      {contactListing && <ContactModal listing={contactListing} onClose={() => setContactListing(null)} />}
      {showNewListing && <NewListingModal onClose={() => setShowNewListing(false)} onAdd={l => { setListings(p => [l, ...p]); setShowNewListing(false); }} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Farmer Marketplace</h1>
          <p className="text-slate-500 mt-1">Buy and sell agricultural products directly — no middlemen.</p>
        </div>
        <button
          onClick={() => setShowNewListing(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition"
        >
          <Plus size={20} /> New Listing
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search crops, location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${selectedCategory === cat ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} found</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filtered.map(listing => (
          <div key={listing.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
            <div className="h-36 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-6xl relative">
              {listing.image}
              <span className="absolute top-3 right-3 bg-white text-green-700 text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-green-100">
                {listing.category}
              </span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-800 text-base">{listing.crop}</h3>
                <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded-full border border-green-100">{listing.quantity}</span>
              </div>
              <StarRating rating={listing.rating} />
              <div className="text-2xl font-extrabold text-green-600 my-3">₹{listing.price.toLocaleString()}<span className="text-sm font-medium text-slate-400">/{listing.unit}</span></div>
              <div className="space-y-1.5 mb-4 flex-1">
                <div className="flex items-center text-slate-500 text-sm gap-2">
                  <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                  {listing.location}
                </div>
                <div className="flex items-center text-slate-500 text-sm gap-2">
                  <Tag size={14} className="text-slate-400 flex-shrink-0" />
                  {listing.farmer}
                </div>
              </div>
              <button
                onClick={() => setContactListing(listing)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition text-sm"
              >
                Contact Seller
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-medium">No listings found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
