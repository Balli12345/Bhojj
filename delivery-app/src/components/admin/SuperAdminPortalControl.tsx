import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, PortalView } from '../../types';
import { 
  Users, 
  ShieldCheck, 
  Store, 
  Bike, 
  ShoppingBag, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Radio, 
  UserPlus, 
  ArrowRight, 
  Trash2, 
  Edit3, 
  Bell, 
  Send,
  Lock,
  Smartphone,
  Globe
} from 'lucide-react';

export const SuperAdminPortalControl: React.FC = () => {
  const { 
    currentUser,
    users, 
    addUser, 
    updateUser, 
    deleteUser, 
    switchUser,
    portalConfig, 
    updatePortalConfig,
    broadcastNotification,
    setCurrentView,
    restaurants,
    riders,
    orders
  } = useApp();

  // Local state for broadcast message
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'system' | 'alert' | 'order'>('system');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Local state for adding a user
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('+91 98000 ');
  const [newUserRole, setNewUserRole] = useState<UserRole>('customer');
  const [newUserCity, setNewUserCity] = useState('Goverdhan');

  // Search/filter users
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = users.filter(u => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.phone.includes(userSearch);
    return matchesRole && matchesSearch;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    broadcastNotification(broadcastTitle, broadcastMessage, broadcastType);
    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    if (editingUser) {
      updateUser({
        ...editingUser,
        name: newUserName,
        email: newUserEmail,
        phone: newUserPhone,
        role: newUserRole,
        city: newUserCity,
      });
      setEditingUser(null);
    } else {
      const newUser: User = {
        id: `user-${newUserRole}-${Date.now()}`,
        name: newUserName,
        email: newUserEmail,
        phone: newUserPhone,
        role: newUserRole,
        city: newUserCity,
        isOnline: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      addUser(newUser);
    }

    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('+91 98000 ');
    setNewUserRole('customer');
    setShowAddUserModal(false);
  };

  const openEditUser = (u: User) => {
    setEditingUser(u);
    setNewUserName(u.name);
    setNewUserEmail(u.email);
    setNewUserPhone(u.phone);
    setNewUserRole(u.role);
    setNewUserCity(u.city || 'Goverdhan');
    setShowAddUserModal(true);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. PORTAL ACCESS & SYSTEM SWITCHES */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Sliders className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Master Portal Control Switches
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enable, disable, or put individual portals into scheduled maintenance mode.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            Platform Engine Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          
          {/* Customer Portal Control */}
          <div className={`p-4 rounded-xl border transition-all ${
            portalConfig.customerPortalEnabled 
              ? 'bg-emerald-50/50 border-emerald-200' 
              : 'bg-red-50/50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  portalConfig.customerPortalEnabled ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Customer Portal</h4>
                  <p className="text-[11px] text-slate-500">Home & Food Ordering App</p>
                </div>
              </div>
              <button
                id="toggle-customer-portal-btn"
                onClick={() => updatePortalConfig({ customerPortalEnabled: !portalConfig.customerPortalEnabled })}
                className={`text-xs font-black px-3 py-1.5 rounded-lg transition-colors ${
                  portalConfig.customerPortalEnabled 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {portalConfig.customerPortalEnabled ? 'ONLINE' : 'OFFLINE'}
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200/60">
              {portalConfig.customerPortalEnabled 
                ? 'Devotees can browse food, customize thalis & place live orders.' 
                : 'Customer ordering paused. Maintenance notice is displayed.'}
            </p>
          </div>

          {/* Restaurant Partner Portal Control */}
          <div className={`p-4 rounded-xl border transition-all ${
            portalConfig.restaurantPortalEnabled 
              ? 'bg-amber-50/50 border-amber-200' 
              : 'bg-red-50/50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  portalConfig.restaurantPortalEnabled ? 'bg-amber-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Kitchen Portal</h4>
                  <p className="text-[11px] text-slate-500">KOT & Food Preparation</p>
                </div>
              </div>
              <button
                id="toggle-restaurant-portal-btn"
                onClick={() => updatePortalConfig({ restaurantPortalEnabled: !portalConfig.restaurantPortalEnabled })}
                className={`text-xs font-black px-3 py-1.5 rounded-lg transition-colors ${
                  portalConfig.restaurantPortalEnabled 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {portalConfig.restaurantPortalEnabled ? 'ONLINE' : 'OFFLINE'}
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200/60">
              {portalConfig.restaurantPortalEnabled 
                ? `${restaurants.length} kitchens can accept orders & update food stock.` 
                : 'Restaurant partner access is temporarily restricted.'}
            </p>
          </div>

          {/* Delivery Rider Portal Control */}
          <div className={`p-4 rounded-xl border transition-all ${
            portalConfig.riderPortalEnabled 
              ? 'bg-sky-50/50 border-sky-200' 
              : 'bg-red-50/50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  portalConfig.riderPortalEnabled ? 'bg-sky-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Rider Fleet Portal</h4>
                  <p className="text-[11px] text-slate-500">Live GPS & OTP Delivery</p>
                </div>
              </div>
              <button
                id="toggle-rider-portal-btn"
                onClick={() => updatePortalConfig({ riderPortalEnabled: !portalConfig.riderPortalEnabled })}
                className={`text-xs font-black px-3 py-1.5 rounded-lg transition-colors ${
                  portalConfig.riderPortalEnabled 
                    ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {portalConfig.riderPortalEnabled ? 'ONLINE' : 'OFFLINE'}
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-200/60">
              {portalConfig.riderPortalEnabled 
                ? `${riders.length} active delivery partners on radar for temple dispatches.` 
                : 'Rider shifts & dispatches are paused.'}
            </p>
          </div>

        </div>

        {/* Global Policy Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800">Auto-Assign Available Riders</span>
              <p className="text-[11px] text-slate-500">Instantly match closest active rider on kitchen order ready</p>
            </div>
            <input
              type="checkbox"
              checked={portalConfig.autoAssignRiders}
              onChange={(e) => updatePortalConfig({ autoAssignRiders: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800">Allow Guest Browse & Cart</span>
              <p className="text-[11px] text-slate-500">Let pilgrims add food to cart before checkout login prompt</p>
            </div>
            <input
              type="checkbox"
              checked={portalConfig.allowGuestCheckout}
              onChange={(e) => updatePortalConfig({ allowGuestCheckout: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* 2. 1-CLICK INSTANT PORTAL LAUNCHPAD */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </span>
              <h3 className="text-lg font-black text-white">
                1-Click Master Portal Jump (Live Switch)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Super Admin can jump directly into any role’s live interface without password re-entry.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          
          <button
            id="admin-jump-customer-portal"
            onClick={() => {
              const custUser = users.find(u => u.role === 'customer') || users[0];
              switchUser(custUser, 'customer_dashboard');
            }}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-orange-500 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold mb-3">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-orange-400 transition-colors">
                Launch Customer Experience
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                View home page slider, browse menus, add thalis & test visual order tracker.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-orange-400">
              <span>Open Customer App</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            id="admin-jump-restaurant-portal"
            onClick={() => {
              const restUser = users.find(u => u.role === 'restaurant') || users[1];
              switchUser(restUser, 'restaurant_dashboard');
            }}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-3">
                <Store className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-amber-400 transition-colors">
                Launch Kitchen Partner App
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                View live KOT orders, kitchen cooking timers, dishes & earnings breakdown.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span>Open Kitchen Partner</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            id="admin-jump-rider-portal"
            onClick={() => {
              const riderUser = users.find(u => u.role === 'delivery') || users[2];
              switchUser(riderUser, 'delivery_dashboard');
            }}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold mb-3">
                <Bike className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-sky-400 transition-colors">
                Launch Rider Fleet App
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Toggle duty shift, accept order pickup runs, enter customer OTP & verify drop.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-sky-400">
              <span>Open Rider App</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>
      </div>

      {/* 3. BROADCAST NOTIFICATION TO ALL PORTALS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-xl bg-orange-100 text-orange-700">
            <Bell className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg font-black text-slate-900">Broadcast Real-Time Alert to All Portals</h3>
            <p className="text-xs text-slate-500">Send an instant push notification toast across all portals</p>
          </div>
        </div>

        <form onSubmit={handleSendBroadcast} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Notification Title</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Parikrama Special Bhog Available!"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alert Category</label>
              <select
                value={broadcastType}
                onChange={(e: any) => setBroadcastType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="system">System Notice</option>
                <option value="alert">Purity / Urgent Alert</option>
                <option value="order">Offer & Promo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
            <input
              type="text"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="e.g. Fresh batch of Mathura Peda and Goverdhan Thalis ready with 100% cow desi ghee."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {broadcastSent && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Broadcast message dispatched to all active users!</span>
              </span>
            )}
            {!broadcastSent && <span></span>}

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Now</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. MASTER USERS & IMPERSONATION MANAGEMENT */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <Users className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Master User Accounts & Impersonation ({users.length} Users)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Switch directly into any user's session to test their permissions and experience.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingUser(null);
              setNewUserName('');
              setNewUserEmail('');
              setNewUserPhone('+91 98000 ');
              setNewUserRole('customer');
              setShowAddUserModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <div className="w-full sm:w-72">
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search user name, email, or phone..."
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'admin', 'restaurant', 'delivery', 'customer'].map((role) => (
              <button
                key={role}
                onClick={() => setUserRoleFilter(role)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize border ${
                  userRoleFilter === role
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {role === 'all' ? 'All Roles' : role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">User & Contact</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">City / Ashram</th>
                <th className="py-3 px-3">Created</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 ${
                          u.role === 'admin' ? 'bg-purple-600' :
                          u.role === 'restaurant' ? 'bg-amber-600' :
                          u.role === 'delivery' ? 'bg-sky-600' : 'bg-emerald-600'
                        }`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-bold border border-purple-200">
                                Current Session
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email} • {u.phone}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        u.role === 'restaurant' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        u.role === 'delivery' ? 'bg-sky-100 text-sky-800 border-sky-200' :
                        'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-700">{u.city || 'Goverdhan'}</td>
                    <td className="py-3 px-3 text-slate-400">{u.createdAt || 'Demo'}</td>

                    <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => switchUser(u)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                        title="Impersonate and switch into this user's portal"
                      >
                        Switch Session
                      </button>

                      <button
                        onClick={() => openEditUser(u)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Edit User"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {users.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete user account "${u.name}"?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-1 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-4">
              {editingUser ? 'Edit User Account' : 'Create New User Account'}
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Radhika Das"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. radhika@bhojj.in"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Platform Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e: any) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                  >
                    <option value="customer">Customer (Devotee)</option>
                    <option value="restaurant">Restaurant Kitchen</option>
                    <option value="delivery">Delivery Fleet Rider</option>
                    <option value="admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City / Zone</label>
                <input
                  type="text"
                  value={newUserCity}
                  onChange={(e) => setNewUserCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
