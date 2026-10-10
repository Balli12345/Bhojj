import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroSlide, CategoryItem, MenuItem } from '../../types';
import { 
  Sliders, 
  Image as ImageIcon, 
  Layers, 
  Layout, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  CheckCircle2, 
  X, 
  Sparkles, 
  Eye, 
  UtensilsCrossed, 
  Tag, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  RefreshCw,
  ShoppingBag,
  Flame,
  Search,
  CheckCheck
} from 'lucide-react';

export const HomePageCmsManager: React.FC = () => {
  const {
    heroSlides,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    resetHeroSlides,
    headerConfig,
    updateHeaderConfig,
    footerConfig,
    updateFooterConfig,
    categoriesList,
    addCategory,
    updateCategory,
    deleteCategory,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    restaurants
  } = useApp();

  // Active CMS Section Tab
  const [cmsSubTab, setCmsSubTab] = useState<'slider' | 'header' | 'footer' | 'categories' | 'products'>('slider');

  // Success message toast
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const triggerSuccessToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // ================= SLIDER STATE & MODAL =================
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideForm, setSlideForm] = useState<Partial<HeroSlide>>({
    chipLabel: '🍛 Royal Thali',
    badge: '✨ GOVERDHAN BESTSELLER • 100% COW GHEE',
    timer: 'Fresh Batch Ready',
    title: 'Shri Radharani Royal Satvik Thali',
    subtitle: '4 Desi Ghee Phulkas, Arhar Dal Tadka, Paneer Bhujia, Jeera Rice & Peda Prasad',
    description: 'Cooked fresh using traditional temple rasoi recipes. Pure Satvik (strictly Zero Onion, Zero Garlic).',
    price: 150,
    mrp: 200,
    savings: 50,
    prepTime: '25-30 min',
    rating: 4.9,
    reviewsCount: '1,420+',
    cta: 'Order This Thali',
    code: 'BHOJJ50',
    couponText: 'FLAT ₹50 OFF with BHOJJ50',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=900&auto=format&fit=crop&q=80',
    category: 'Daily Thali',
    isActive: true,
  });

  const presetImages = [
    { label: 'Royal Thali', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=900&auto=format&fit=crop&q=80' },
    { label: 'Ashram Tiffin', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&auto=format&fit=crop&q=80' },
    { label: 'Mathura Peda', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=900&auto=format&fit=crop&q=80' },
    { label: 'Bhandara Poori', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=900&auto=format&fit=crop&q=80' },
    { label: 'Ghee Samosa', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&auto=format&fit=crop&q=80' },
    { label: 'Jalebi Rabri', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=900&auto=format&fit=crop&q=80' }
  ];

  const openAddSlide = () => {
    setEditingSlide(null);
    setSlideForm({
      chipLabel: '🍛 New Special',
      badge: '✨ SPECIAL BHOG • 100% DESI GHEE',
      timer: 'Freshly Prepared',
      title: 'Giriraj Special Prasadam Thali',
      subtitle: 'Pure Satvik Mahaprasad prepared for Goverdhan devotees',
      description: 'Zero onion, zero garlic sacred food blessed at temple.',
      price: 140,
      mrp: 180,
      savings: 40,
      prepTime: '20 min',
      rating: 4.9,
      reviewsCount: '500+',
      cta: 'Order Now',
      code: 'BHOJJ50',
      couponText: 'FLAT ₹50 OFF',
      image: presetImages[0].url,
      category: 'Daily Thali',
      isActive: true,
    });
    setShowSlideModal(true);
  };

  const openEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideForm({ ...slide });
    setShowSlideModal(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideForm.title || !slideForm.image) return;

    const price = Number(slideForm.price) || 120;
    const mrp = Number(slideForm.mrp) || 160;
    const savings = Math.max(0, mrp - price);

    if (editingSlide) {
      updateHeroSlide({
        ...editingSlide,
        ...slideForm,
        price,
        mrp,
        savings,
      } as HeroSlide);
      triggerSuccessToast('Slide updated successfully!');
    } else {
      const newSlide: HeroSlide = {
        id: `slide-${Date.now()}`,
        menuId: 'satvik-2',
        chipLabel: slideForm.chipLabel || '🍛 Featured',
        badge: slideForm.badge || '✨ SPECIAL BHOG',
        timer: slideForm.timer || 'Fresh Ready',
        title: slideForm.title || 'Special Dish',
        subtitle: slideForm.subtitle || '',
        description: slideForm.description || '',
        price,
        mrp,
        savings,
        prepTime: slideForm.prepTime || '20 min',
        rating: Number(slideForm.rating) || 4.9,
        reviewsCount: slideForm.reviewsCount || '100+',
        pills: ['100% Desi Cow Ghee', 'No Onion, No Garlic', 'Hot Delivery'],
        cta: slideForm.cta || 'Order Now',
        code: slideForm.code || 'BHOJJ50',
        couponText: slideForm.couponText || 'FLAT ₹50 OFF',
        image: slideForm.image || presetImages[0].url,
        category: (slideForm.category as any) || 'Daily Thali',
        isActive: slideForm.isActive ?? true,
      };
      addHeroSlide(newSlide);
      triggerSuccessToast('New slide added to Home Page!');
    }
    setShowSlideModal(false);
  };

  // ================= HEADER & FOOTER FORMS =================
  const [headerState, setHeaderState] = useState(headerConfig);
  const [footerState, setFooterState] = useState(footerConfig);

  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeaderConfig(headerState);
    triggerSuccessToast('Header and announcement settings saved!');
  };

  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooterConfig(footerState);
    triggerSuccessToast('Footer and trust badge settings saved!');
  };

  // ================= CATEGORY STATE & MODAL =================
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [catForm, setCatForm] = useState<Partial<CategoryItem>>({
    name: '',
    desc: '',
    badge: '',
    iconName: 'UtensilsCrossed',
    isActive: true,
  });

  const openAddCategory = () => {
    setEditingCategory(null);
    setCatForm({
      name: '',
      desc: '',
      badge: '',
      iconName: 'UtensilsCrossed',
      isActive: true,
    });
    setShowCategoryModal(true);
  };

  const openEditCategory = (c: CategoryItem) => {
    setEditingCategory(c);
    setCatForm({ ...c });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name) return;

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        ...catForm,
      } as CategoryItem);
      triggerSuccessToast('Category updated!');
    } else {
      const newCat: CategoryItem = {
        id: catForm.name.trim(),
        name: catForm.name.trim(),
        desc: catForm.desc || '',
        badge: catForm.badge || '',
        iconName: catForm.iconName || 'UtensilsCrossed',
        isActive: catForm.isActive ?? true,
      };
      addCategory(newCat);
      triggerSuccessToast('Category added!');
    }
    setShowCategoryModal(false);
  };

  // ================= PRODUCTS / DISHES STATE & MODAL =================
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [prodSearch, setProdSearch] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState('all');
  const [prodForm, setProdForm] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 120,
    mrp: 150,
    category: 'Daily Thali',
    image: presetImages[0].url,
    isVeg: true,
    inStock: true,
    prepTimeMinutes: 20,
    restaurantId: restaurants[0]?.id || 'rest-1',
  });

  const openAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      description: '',
      price: 120,
      mrp: 150,
      category: 'Daily Thali',
      image: presetImages[0].url,
      isVeg: true,
      inStock: true,
      prepTimeMinutes: 20,
      restaurantId: restaurants[0]?.id || 'rest-1',
    });
    setShowProductModal(true);
  };

  const openEditProduct = (item: MenuItem) => {
    setEditingProduct(item);
    setProdForm({ ...item });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name) return;

    const price = Number(prodForm.price) || 99;
    const mrp = Number(prodForm.mrp) || Math.round(price * 1.25);

    if (editingProduct) {
      updateMenuItem({
        ...editingProduct,
        ...prodForm,
        price,
        mrp,
      } as MenuItem);
      triggerSuccessToast(`Updated dish: ${prodForm.name}`);
    } else {
      const newItem: MenuItem = {
        id: `prod-${Date.now()}`,
        restaurantId: prodForm.restaurantId || restaurants[0]?.id || 'rest-1',
        name: prodForm.name,
        description: prodForm.description || '',
        price,
        mrp,
        category: (prodForm.category as any) || 'Daily Thali',
        image: prodForm.image || presetImages[0].url,
        isVeg: true,
        inStock: prodForm.inStock ?? true,
        prepTimeMinutes: Number(prodForm.prepTimeMinutes) || 20,
        rating: 4.9,
        reviewsCount: 120,
      };
      addMenuItem(newItem);
      triggerSuccessToast(`Added new dish: ${newItem.name}`);
    }
    setShowProductModal(false);
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(prodSearch.toLowerCase());
    const matchesCat = prodCategoryFilter === 'all' || item.category === prodCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Sub-Navigation for CMS */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-orange-100 text-orange-700">
                <Layout className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Home Page Content Management (CMS)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Customize slider banners, header ticker, footer trust highlights, category list & food catalog.
            </p>
          </div>

          {saveSuccessMsg && (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5 animate-in fade-in">
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* CMS Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setCmsSubTab('slider')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cmsSubTab === 'slider' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Slider & Banners ({heroSlides.length})</span>
          </button>

          <button
            onClick={() => setCmsSubTab('header')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cmsSubTab === 'header' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Header & Announcement</span>
          </button>

          <button
            onClick={() => setCmsSubTab('footer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cmsSubTab === 'footer' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Footer & Trust Badges</span>
          </button>

          <button
            onClick={() => setCmsSubTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cmsSubTab === 'categories' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Manage Categories ({categoriesList.length})</span>
          </button>

          <button
            onClick={() => setCmsSubTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              cmsSubTab === 'products' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Products & Dishes ({menuItems.length})</span>
          </button>
        </div>
      </div>

      {/* ================= 1. SLIDER & BANNERS CMS ================= */}
      {cmsSubTab === 'slider' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Home Page Food Slides</h3>
              <p className="text-xs text-slate-500">Add, edit, toggle visibility, and update dish photos & prices</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={resetHeroSlides}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition-colors"
                title="Restore default Govardhan temple slides"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={openAddSlide}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Slide</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heroSlides.map((slide, idx) => (
              <div 
                key={slide.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden p-4 flex flex-col justify-between ${
                  slide.isActive ? 'border-slate-200 shadow-xs' : 'border-slate-200/60 opacity-60 bg-slate-50'
                }`}
              >
                <div className="flex gap-3">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative bg-slate-100">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-slate-950/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                        {slide.chipLabel}
                      </span>
                      {slide.code && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          {slide.code}
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 truncate">{slide.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{slide.subtitle}</p>
                    
                    <div className="flex items-center gap-2 text-xs pt-1">
                      <span className="font-black text-slate-900">₹{slide.price}</span>
                      {slide.mrp && <span className="text-slate-400 line-through text-[11px]">₹{slide.mrp}</span>}
                      {slide.savings > 0 && <span className="text-emerald-600 font-bold text-[11px]">Save ₹{slide.savings}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateHeroSlide({ ...slide, isActive: !slide.isActive })}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                        slide.isActive 
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {slide.isActive ? 'Active on Home' : 'Hidden'}
                    </button>
                    <span className="text-slate-400 text-[11px]">⭐ {slide.rating}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditSlide(slide)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                      title="Edit Slide"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {heroSlides.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete slide "${slide.title}"?`)) {
                            deleteHeroSlide(slide.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 2. HEADER & ANNOUNCEMENT CMS ================= */}
      {cmsSubTab === 'header' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Header Branding & Announcement Ticker</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Change the top ticker text, promo banner, helpline phone & default ashram drop point.
            </p>
          </div>

          <form onSubmit={handleSaveHeader} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={headerState.brandName}
                  onChange={(e) => setHeaderState({ ...headerState, brandName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Tagline / Subtitle</label>
                <input
                  type="text"
                  value={headerState.brandTagline}
                  onChange={(e) => setHeaderState({ ...headerState, brandTagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Top Announcement Bar Text</label>
                <input
                  type="text"
                  value={headerState.announcementText}
                  onChange={(e) => setHeaderState({ ...headerState, announcementText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ticker Coupon Code</label>
                <input
                  type="text"
                  value={headerState.announcementCode}
                  onChange={(e) => setHeaderState({ ...headerState, announcementCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ashram Seva 24x7 Helpline Phone</label>
                <input
                  type="text"
                  value={headerState.helplinePhone}
                  onChange={(e) => setHeaderState({ ...headerState, helplinePhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Default Ashram Hub</label>
                <input
                  type="text"
                  value={headerState.defaultAshramLocation}
                  onChange={(e) => setHeaderState({ ...headerState, defaultAshramLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={headerState.showAnnouncement}
                  onChange={(e) => setHeaderState({ ...headerState, showAnnouncement: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span className="font-bold text-slate-800">Display Orange Announcement Ticker on Top of Screen</span>
              </label>
            </div>

            {/* Live Ticker Preview */}
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden truncate">
                <Flame className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                <span className="font-extrabold">{headerState.brandName} (Goverdhan, UP):</span>
                <span>{headerState.announcementText}</span>
                <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase">
                  Code: {headerState.announcementCode}
                </span>
              </div>
              <span className="text-[10px] font-bold text-white/80 shrink-0">Live Preview</span>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
              >
                Save Header Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= 3. FOOTER & TRUST BADGES CMS ================= */}
      {cmsSubTab === 'footer' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Footer Information & Purity Highlights</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update kitchen address, support emails, copyright, and the 4 purity bullet points shown devotees.
            </p>
          </div>

          <form onSubmit={handleSaveFooter} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">About Us / Mission Description</label>
              <textarea
                rows={3}
                value={footerState.aboutDescription}
                onChange={(e) => setFooterState({ ...footerState, aboutDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Support Phone</label>
                <input
                  type="text"
                  value={footerState.contactPhone}
                  onChange={(e) => setFooterState({ ...footerState, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilgrim Support Email</label>
                <input
                  type="email"
                  value={footerState.contactEmail}
                  onChange={(e) => setFooterState({ ...footerState, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Daily Kitchen Service Hours</label>
                <input
                  type="text"
                  value={footerState.operatingHours}
                  onChange={(e) => setFooterState({ ...footerState, operatingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kitchen Physical Address</label>
              <input
                type="text"
                value={footerState.contactAddress}
                onChange={(e) => setFooterState({ ...footerState, contactAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                required
              />
            </div>

            {/* 4 Trust Highlights */}
            <div className="pt-3 border-t border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 mb-3">4 Purity & Trust Badges</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge 1: Desi Cow Ghee Text</label>
                  <input
                    type="text"
                    value={footerState.featurePurityText}
                    onChange={(e) => setFooterState({ ...footerState, featurePurityText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge 2: Zero Onion & Garlic Text</label>
                  <input
                    type="text"
                    value={footerState.featureNoOnionText}
                    onChange={(e) => setFooterState({ ...footerState, featureNoOnionText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge 3: Delivery Speed Text</label>
                  <input
                    type="text"
                    value={footerState.featureAshramText}
                    onChange={(e) => setFooterState({ ...footerState, featureAshramText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge 4: Eco Packaging & Standards</label>
                  <input
                    type="text"
                    value={footerState.featurePackagingText}
                    onChange={(e) => setFooterState({ ...footerState, featurePackagingText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Copyright Notice Text</label>
              <input
                type="text"
                value={footerState.copyrightText}
                onChange={(e) => setFooterState({ ...footerState, copyrightText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                required
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
              >
                Save Footer Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= 4. MANAGE CATEGORIES CMS ================= */}
      {cmsSubTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Food Categories ({categoriesList.length})</h3>
              <p className="text-xs text-slate-500">Categories appear on the Home Page explore section and food filters</p>
            </div>
            
            <button
              onClick={openAddCategory}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoriesList.map((cat) => (
              <div 
                key={cat.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-base text-slate-900">{cat.name}</span>
                    {cat.badge && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{cat.desc || 'No description provided'}</p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100 text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {cat.isActive ? 'Active' : 'Disabled'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditCategory(cat)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                      title="Edit Category"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {categoriesList.length > 2 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 5. MANAGE PRODUCTS (MENU ITEMS) CMS ================= */}
      {cmsSubTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Food Menu Catalog ({menuItems.length} Dishes)</h3>
              <p className="text-xs text-slate-500">Manage all dishes, prices, in-stock switches, and food descriptions</p>
            </div>
            
            <button
              onClick={openAddProduct}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={prodSearch}
                onChange={(e) => setProdSearch(e.target.value)}
                placeholder="Search dish name or ingredients..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <select
                value={prodCategoryFilter}
                onChange={(e) => setProdCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
              >
                <option value="all">All Categories</option>
                {categoriesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dishes Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Dish</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price / MRP</th>
                    <th className="py-3 px-4">Prep Time</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredMenuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200" />
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{item.name}</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" title="100% Satvik Veg"></span>
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{item.description}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900">₹{item.price}</span>
                        {item.mrp && <span className="text-slate-400 line-through text-[11px] ml-1.5">₹{item.mrp}</span>}
                      </td>

                      <td className="py-3 px-4 text-slate-600">{item.prepTimeMinutes} mins</td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => updateMenuItem({ ...item, inStock: !item.inStock })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ${
                            item.inStock 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {item.inStock ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => openEditProduct(item)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                          title="Edit Dish"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {menuItems.length > 3 && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete dish "${item.name}"?`)) {
                                deleteMenuItem(item.id);
                              }
                            }}
                            className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                            title="Delete Dish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SLIDE ================= */}
      {showSlideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {editingSlide ? 'Edit Home Slider Banner' : 'Add New Home Slider Banner'}
              </h3>
              <button onClick={() => setShowSlideModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title (Dish / Thali Name)</label>
                  <input
                    type="text"
                    value={slideForm.title}
                    onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chip Label (Tab Title)</label>
                  <input
                    type="text"
                    value={slideForm.chipLabel}
                    onChange={(e) => setSlideForm({ ...slideForm, chipLabel: e.target.value })}
                    placeholder="e.g. 🍛 Royal Thali"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Top Badge Text</label>
                <input
                  type="text"
                  value={slideForm.badge}
                  onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                  placeholder="e.g. ✨ GOVERDHAN BESTSELLER • 100% COW GHEE"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subtitle (Included items)</label>
                <input
                  type="text"
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  placeholder="e.g. 4 Phulkas, Arhar Dal Tadka, Paneer Bhujia, Jeera Rice & Peda"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={slideForm.price}
                    onChange={(e) => setSlideForm({ ...slideForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={slideForm.mrp}
                    onChange={(e) => setSlideForm({ ...slideForm, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={slideForm.prepTime}
                    onChange={(e) => setSlideForm({ ...slideForm, prepTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={slideForm.code}
                    onChange={(e) => setSlideForm({ ...slideForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Text</label>
                  <input
                    type="text"
                    value={slideForm.couponText}
                    onChange={(e) => setSlideForm({ ...slideForm, couponText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={slideForm.image}
                  onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  required
                />
                
                {/* Preset image buttons */}
                <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-slate-400 font-bold">Presets:</span>
                  {presetImages.map(p => (
                    <button
                      type="button"
                      key={p.label}
                      onClick={() => setSlideForm({ ...slideForm, image: p.url })}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-800"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={slideForm.isActive}
                    onChange={(e) => setSlideForm({ ...slideForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Slide is Active on Home Page</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSlideModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT CATEGORY ================= */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-3">
              {editingCategory ? 'Edit Food Category' : 'Add Food Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Daily Thali, Prasad, Beverages"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={catForm.desc}
                  onChange={(e) => setCatForm({ ...catForm, desc: e.target.value })}
                  placeholder="e.g. Wholesome homestyle satvik thalis"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Badge Tag (Optional)</label>
                <input
                  type="text"
                  value={catForm.badge}
                  onChange={(e) => setCatForm({ ...catForm, badge: e.target.value })}
                  placeholder="e.g. POPULAR, MANDIR, HEALTHY"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={catForm.isActive}
                    onChange={(e) => setCatForm({ ...catForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Category Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 my-8">
            <h3 className="text-base font-black text-slate-900 mb-3">
              {editingProduct ? 'Edit Food Dish' : 'Add New Food Dish'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dish Name</label>
                  <input
                    type="text"
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e: any) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                  >
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Ingredients</label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={prodForm.mrp}
                    onChange={(e) => setProdForm({ ...prodForm, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={prodForm.prepTimeMinutes}
                    onChange={(e) => setProdForm({ ...prodForm, prepTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  required
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.inStock}
                    onChange={(e) => setProdForm({ ...prodForm, inStock: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span className="font-bold text-slate-800">Available In Stock for Ordering</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
