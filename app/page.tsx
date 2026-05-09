'use client';

import { useState, useEffect } from 'react';

interface Camp {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  type: string[];
  amenities: string[];
  amenityIcons: string[];
  desc: string;
  color1: string;
  color2: string;
  color3: string;
}

const camps: Camp[] = [
  { id:1, name:"Birchwood Hollow", location:"Concord, MA", price:55, rating:4.9, reviews:42, type:["primitive","pets"], amenities:["Fire pit","Creek access","Outhouse","Dog friendly"], amenityIcons:["🔥","💧","🚻","🐕"], desc:"A secluded 3-acre clearing tucked behind a 200-year-old birch grove. Pristine quiet, minimal footprint. No hookups — pure nature.", color1:"#2D5A27", color2:"#3D7A35", color3:"#5A9E50" },
  { id:2, name:"Osprey Pond Camp", location:"Stow, MA", price:75, rating:4.8, reviews:67, type:["waterfront","group"], amenities:["Private pond","Kayaks","Fire pit","Picnic tables"], amenityIcons:["🏞️","🛶","🔥","🪑"], desc:"Wake up 30 feet from a private spring-fed pond. Two kayaks included. Perfect for small groups up to 8 people.", color1:"#1A4A6B", color2:"#2A6A9B", color3:"#4A8ABB" },
  { id:3, name:"Maple Ridge Farm", location:"Harvard, MA", price:65, rating:4.7, reviews:31, type:["farm","pets","group"], amenities:["Farm animals","Wifi","Hot shower","Fire pit"], amenityIcons:["🐄","📶","🚿","🔥"], desc:"Camp on a working 40-acre farm. Fall asleep to crickets, wake up to roosters. Morning farm tour available.", color1:"#6B4A1A", color2:"#9B6A2A", color3:"#BB8A4A" },
  { id:4, name:"Pine Ledge Summit", location:"Carlisle, MA", price:45, rating:4.9, reviews:18, type:["primitive"], amenities:["Ridge views","Star gazing","Fire ring","Composting toilet"], amenityIcons:["🌄","⭐","🔥","🚻"], desc:"The highest private camp in the county. On clear nights the Milky Way is fully visible. Pure backcountry experience.", color1:"#4A3A2A", color2:"#6A5A4A", color3:"#8A7A6A" },
  { id:5, name:"Heronwood Retreat", location:"Acton, MA", price:90, rating:5.0, reviews:24, type:["waterfront","group","pets"], amenities:["River frontage","Fire pit","Outdoor kitchen","Pet friendly"], amenityIcons:["🏞️","🔥","🍳","🐕"], desc:"200ft of private river frontage on the Assabet. Outdoor kitchen and covered prep area — ideal for groups.", color1:"#1A5A3A", color2:"#2A7A5A", color3:"#4A9A7A" },
  { id:6, name:"Westwind Meadow", location:"Boxborough, MA", price:50, rating:4.6, reviews:39, type:["farm","group"], amenities:["Open meadow","Group fire pit","Stargazing","Wildflowers"], amenityIcons:["🌾","🔥","⭐","🌸"], desc:"A sweeping 6-acre wildflower meadow with zero light pollution. Hosts up to 20 people.", color1:"#4A5A1A", color2:"#6A7A2A", color3:"#8A9A4A" }
];

const filters = [
  { key: 'all', label: 'All sites' },
  { key: 'primitive', label: '🏕️ Primitive' },
  { key: 'waterfront', label: '🏞️ Waterfront' },
  { key: 'farm', label: '🌾 Farm stay' },
  { key: 'group', label: '👥 Group friendly' },
  { key: 'pets', label: '🐕 Pet friendly' },
];

function CampSVG({ camp, height = 180 }: { camp: Camp; height?: number }) {
  return (
    <svg viewBox={`0 0 400 ${height}`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height={height} fill={camp.color1}/>
      <ellipse cx="200" cy={height + 30} rx="280" ry="80" fill={camp.color2} opacity="0.7"/>
      <polygon points={`60,${height} 120,${height*0.35} 180,${height}`} fill={camp.color3} opacity="0.9"/>
      <polygon points={`140,${height} 210,${height*0.2} 280,${height}`} fill={camp.color2} opacity="0.95"/>
      <polygon points={`220,${height} 280,${height*0.4} 340,${height}`} fill={camp.color3} opacity="0.85"/>
      <circle cx="320" cy={height*0.18} r={height*0.09} fill="rgba(255,240,180,0.9)"/>
      <polygon points={`185,${height} 193,${height*0.78} 201,${height}`} fill="#F5A030" opacity="0.9"/>
      <ellipse cx="193" cy={height*0.73} rx="10" ry="10" fill="#F5A030" opacity="0.7"/>
    </svg>
  );
}

export default function Home() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activeCamp, setActiveCamp] = useState<Camp | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [guests, setGuests] = useState(2);

  const filteredCamps = camps.filter(c => {
    const matchesFilter = filter === 'all' || c.type.includes(filter);
    const q = search.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const openModal = (camp: Camp) => {
    setActiveCamp(camp);
    const today = new Date();
    const fri = new Date(today);
    fri.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7 || 7));
    const sun = new Date(fri);
    sun.setDate(fri.getDate() + 2);
    setCheckin(fri.toISOString().split('T')[0]);
    setCheckout(sun.toISOString().split('T')[0]);
    setGuests(2);
  };

  const nights = checkin && checkout
    ? Math.max(1, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / (1000*60*60*24)))
    : 0;
  const subtotal = activeCamp ? activeCamp.price * nights : 0;
  const fee = Math.round(subtotal * 0.12);
  const total = subtotal + fee;

  const confirmBooking = () => {
    if (!checkin || !checkout) return;
    setActiveCamp(null);
    setShowSuccess(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --forest: #2D4A2D; --forest-mid: #3D6B3D; --cream: #F5F0E8;
          --cream-dark: #EDE6D6; --bark-light: #C4A882; --ember: #C4622D;
          --text: #1C2B1C; --text-muted: #5A6B5A; --shadow: rgba(44,74,44,0.12);
        }
        body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text); }
        nav { background: var(--forest); padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 60px; position: sticky; top: 0; z-index: 100; }
        .logo { font-family: 'Fraunces', serif; font-size: 22px; color: var(--cream); display: flex; align-items: center; gap: 8px; }
        .logo .happy { font-style: italic; color: var(--bark-light); }
        .nav-links { display: flex; gap: 1.5rem; align-items: center; }
        .nav-link { color: var(--cream); opacity: 0.75; font-size: 14px; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; }
        .nav-btn { background: var(--ember); color: white; border: none; padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .hero { background: var(--forest); padding: 3.5rem 2rem 4rem; text-align: center; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: var(--cream); clip-path: ellipse(55% 100% at 50% 100%); }
        .hero-tag { display: inline-block; background: rgba(196,168,130,0.2); color: var(--bark-light); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 1rem; }
        .hero h1 { font-family: 'Fraunces', serif; font-size: clamp(2rem, 5vw, 3.2rem); color: var(--cream); font-weight: 300; line-height: 1.15; margin-bottom: 0.75rem; }
        .hero h1 em { font-style: italic; color: var(--bark-light); }
        .hero p { color: rgba(245,240,232,0.7); font-size: 15px; max-width: 480px; margin: 0 auto 2rem; line-height: 1.6; }
        .search-bar { background: white; border-radius: 50px; display: flex; align-items: center; max-width: 600px; margin: 0 auto; padding: 6px 6px 6px 20px; gap: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); position: relative; z-index: 1; }
        .search-bar input { flex: 1; border: none; outline: none; font-size: 14px; font-family: 'DM Sans', sans-serif; color: var(--text); background: transparent; }
        .search-bar input::placeholder { color: var(--text-muted); }
        .search-btn { background: var(--forest); color: white; border: none; padding: 10px 22px; border-radius: 40px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .filters { padding: 1.5rem 2rem 0.5rem; display: flex; gap: 10px; flex-wrap: wrap; max-width: 1100px; margin: 0 auto; }
        .filter-chip { background: white; border: 1px solid var(--cream-dark); border-radius: 20px; padding: 6px 16px; font-size: 13px; cursor: pointer; transition: all 0.2s; color: var(--text-muted); font-family: 'DM Sans', sans-serif; }
        .filter-chip.active, .filter-chip:hover { background: var(--forest); color: white; border-color: var(--forest); }
        .main { padding: 1.5rem 2rem 3rem; max-width: 1100px; margin: 0 auto; }
        .section-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.25rem; }
        .section-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 400; }
        .count { font-size: 13px; color: var(--text-muted); }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
        .card { background: white; border-radius: 16px; overflow: hidden; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 2px 8px var(--shadow); border: none; padding: 0; text-align: left; font-family: inherit; width: 100%; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px var(--shadow); }
        .card-img { height: 180px; position: relative; overflow: hidden; }
        .card-img svg { width: 100%; height: 100%; display: block; }
        .card-badge { position: absolute; top: 12px; left: 12px; background: white; border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: 500; color: var(--forest); }
        .card-fav { position: absolute; top: 12px; right: 12px; background: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .card-body { padding: 1rem 1.1rem 1.1rem; }
        .card-location { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .card-name { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 400; margin-bottom: 8px; }
        .card-amenities { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
        .amenity-tag { background: var(--cream); color: var(--text-muted); font-size: 11px; padding: 3px 8px; border-radius: 10px; }
        .card-footer { display: flex; justify-content: space-between; align-items: center; }
        .card-price { font-size: 15px; color: var(--text); }
        .card-price strong { font-size: 19px; color: var(--forest); }
        .card-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text-muted); }
        .star { color: var(--ember); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(28,43,28,0.6); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .modal { background: white; border-radius: 20px; width: 100%; max-width: 560px; max-height: 88vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); position: relative; }
        .modal-header { position: relative; height: 220px; overflow: hidden; border-radius: 20px 20px 0 0; }
        .modal-header svg { width: 100%; height: 100%; display: block; }
        .modal-close { position: absolute; top: 14px; right: 14px; background: white; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text); z-index: 10; }
        .modal-body { padding: 1.5rem; }
        .modal-location { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .modal-name { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 400; margin: 4px 0 12px; }
        .modal-desc { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-bottom: 1.25rem; }
        .modal-amenities { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .modal-amenity { display: flex; align-items: center; gap: 6px; background: var(--cream); padding: 6px 12px; border-radius: 20px; font-size: 13px; color: var(--forest); }
        .book-section { border-top: 1px solid var(--cream-dark); padding-top: 1.25rem; }
        .book-section label { font-size: 13px; color: var(--text-muted); display: block; margin-bottom: 4px; }
        .date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
        .date-row input, .guest-input { border: 1.5px solid var(--cream-dark); border-radius: 10px; padding: 10px 12px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: var(--text); width: 100%; outline: none; }
        .guest-row { margin-bottom: 1.25rem; }
        .price-breakdown { background: var(--cream); border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem; font-size: 13px; }
        .price-line { display: flex; justify-content: space-between; padding: 3px 0; color: var(--text-muted); }
        .price-line.total { color: var(--text); font-weight: 500; font-size: 15px; border-top: 1px solid var(--cream-dark); margin-top: 8px; padding-top: 8px; }
        .book-btn { width: 100%; background: var(--forest); color: white; border: none; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .success-overlay { position: fixed; inset: 0; background: rgba(28,43,28,0.7); z-index: 300; display: flex; align-items: center; justify-content: center; }
        .success-card { background: white; border-radius: 20px; padding: 2.5rem; text-align: center; max-width: 360px; width: 90%; }
        .success-icon { font-size: 52px; margin-bottom: 1rem; }
        .success-card h2 { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 400; margin-bottom: 8px; }
        .success-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem; }
        .success-tagline { font-family: 'Fraunces', serif; font-style: italic; color: #8B6F47; font-size: 13px; margin-bottom: 1.25rem; }
        .success-btn { background: var(--forest); color: white; border: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
      `}</style>

      <nav>
        <div className="logo">
          <span>⛺</span>
          <span><span className="happy">Happy</span> Camper</span>
        </div>
        <div className="nav-links">
          <button className="nav-link">Explore</button>
          <button className="nav-link">List your land</button>
          <button className="nav-btn">Sign in</button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-tag">🌲 New England&apos;s best private campsites</div>
        <h1>Sleep under <em>real</em> stars.<br />Not government waitlists.</h1>
        <p>Book independent campgrounds, farms, and private land — instantly. No lottery. No Recreation.gov.</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Where are you headed? City, town, or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn">Find sites →</button>
        </div>
      </div>

      <div className="filters">
        {filters.map(f => (
          <button
            key={f.key}
            className={`filter-chip ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="main">
        <div className="section-header">
          <div className="section-title">Available this weekend</div>
          <div className="count">{filteredCamps.length} site{filteredCamps.length !== 1 ? 's' : ''} found</div>
        </div>
        <div className="grid">
          {filteredCamps.map(camp => (
            <button key={camp.id} className="card" onClick={() => openModal(camp)}>
              <div className="card-img">
                <CampSVG camp={camp} />
                <div className="card-badge">⭐ {camp.rating}</div>
                <span className="card-fav" onClick={(e) => e.stopPropagation()}>♡</span>
              </div>
              <div className="card-body">
                <div className="card-location">📍 {camp.location}</div>
                <div className="card-name">{camp.name}</div>
                <div className="card-amenities">
                  {camp.amenities.slice(0, 3).map(a => (
                    <span key={a} className="amenity-tag">{a}</span>
                  ))}
                </div>
                <div className="card-footer">
                  <div className="card-price"><strong>${camp.price}</strong> / night</div>
                  <div className="card-rating"><span className="star">★</span> {camp.rating} ({camp.reviews})</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeCamp && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setActiveCamp(null); }}>
          <div className="modal">
            <div className="modal-header">
              <CampSVG camp={activeCamp} height={220} />
            </div>
            <button className="modal-close" onClick={() => setActiveCamp(null)}>✕</button>
            <div className="modal-body">
              <div className="modal-location">📍 {activeCamp.location}</div>
              <div className="modal-name">{activeCamp.name}</div>
              <div className="modal-desc">{activeCamp.desc}</div>
              <div className="modal-amenities">
                {activeCamp.amenities.map((a, i) => (
                  <span key={a} className="modal-amenity">{activeCamp.amenityIcons[i]} {a}</span>
                ))}
              </div>
              <div className="book-section">
                <div className="date-row">
                  <div>
                    <label>Check-in</label>
                    <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} />
                  </div>
                  <div>
                    <label>Check-out</label>
                    <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} />
                  </div>
                </div>
                <div className="guest-row">
                  <label>Guests</label>
                  <input
                    className="guest-input"
                    type="number"
                    value={guests}
                    min={1}
                    max={20}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  />
                </div>
                <div className="price-breakdown">
                  <div className="price-line">
                    <span>${activeCamp.price} x {nights} night{nights !== 1 ? 's' : ''}</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="price-line">
                    <span>Happy Camper service fee</span>
                    <span>${fee}</span>
                  </div>
                  <div className="price-line total">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
                <button className="book-btn" onClick={confirmBooking}>Reserve your site →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-overlay">
          <div className="success-card">
            <div className="success-icon">⛺</div>
            <h2>You&apos;re a Happy Camper!</h2>
            <p>Your site is reserved. The landowner will confirm within 2 hours.</p>
            <div className="success-tagline">&quot;Leave it better than you found it.&quot;</div>
            <button className="success-btn" onClick={() => setShowSuccess(false)}>Back to explore</button>
          </div>
        </div>
      )}
    </>
  );
}