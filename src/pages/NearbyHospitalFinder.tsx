import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Search,
  PhoneCall,
  Clock,
  Bed,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  ExternalLink,
  Compass,
  ArrowRight,
  Filter,
  Building,
  Activity,
  Navigation,
  RefreshCw,
  AlertTriangle,
  Radio,
  Layers,
  Phone,
  Info
} from 'lucide-react';
import { VerifiedHospital } from '../types';
import {
  getVerifiedHospitalsByLocation,
  allVerifiedHospitals,
  calculateDistanceKm
} from '../data/verifiedHospitals';
import { HospitalMap } from '../components/HospitalMap';

export const NearbyHospitalFinder: React.FC = () => {
  const { language, t } = useLanguage();
  const { selectedSearchLocation, setSelectedSearchLocation, selectedNearbyHospital, setSelectedNearbyHospital, navigateTo, triggerEmergencySos } = useApp();

  // Location & Search States
  const [searchLocationInput, setSearchLocationInput] = useState(selectedSearchLocation || 'Panihati, West Bengal');
  const [activeLocationQuery, setActiveLocationQuery] = useState(selectedSearchLocation || 'Panihati, West Bengal');
  const [filterQuery, setFilterQuery] = useState('');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<'All' | 'Hospital' | 'Nursing Home' | 'Diagnostic & Clinic'>('All');
  const [selectedHospital, setSelectedHospital] = useState<VerifiedHospital | null>(selectedNearbyHospital || null);

  const handleSelectHospital = (hosp: VerifiedHospital | null) => {
    setSelectedHospital(hosp);
    setSelectedNearbyHospital(hosp);
  };

  // GPS Geolocation States
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'denied' | 'unavailable'>('idle');
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');

  // Suggestions for fast clicking
  const locationSuggestions = [
    'Panihati, West Bengal',
    'Dum Dum, West Bengal',
    'Sodepur, Kolkata',
    'Agarpara, Kolkata',
    'Khardaha, Kolkata',
    'Belgharia, Kolkata'
  ];

  // Detect GPS Location
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('unavailable');
      setGpsErrorMsg('আপনার ব্রাউজারে জিপিএস সমর্থন উপলব্ধ নেই (Geolocation is not supported by your browser).');
      return;
    }

    setGpsStatus('locating');
    setGpsErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      position => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoordinates(coords);
        setGpsStatus('success');
        setActiveLocationQuery('GPS Current Location');
      },
      error => {
        if (error.code === error.PERMISSION_DENIED) {
          setGpsStatus('denied');
          setGpsErrorMsg('জিপিএস অ্যাক্সেসের অনুমতি দেওয়া হয়নি। অনুগ্রহ করে ম্যানুয়াল এলাকা অনুসন্ধান ব্যবহার করুন (Location permission was denied. Please select or type an area).');
        } else {
          setGpsStatus('unavailable');
          setGpsErrorMsg('বর্তমান অবস্থান সনাক্ত করা সম্ভব হয়নি। ম্যানুয়াল অনুসন্ধান করুন (Unable to retrieve GPS coordinates).');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleManualSearch = (loc: string) => {
    setUserCoordinates(null);
    setGpsStatus('idle');
    setSearchLocationInput(loc);
    setActiveLocationQuery(loc);
    setSelectedSearchLocation(loc);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocationInput.trim()) {
      handleManualSearch(searchLocationInput.trim());
    }
  };

  // Get matching facilities
  const rawHospitals = getVerifiedHospitalsByLocation(activeLocationQuery, userCoordinates);

  const filteredHospitals = rawHospitals.filter(facility => {
    const matchesSearch =
      facility.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      facility.nameBn.includes(filterQuery) ||
      facility.address.toLowerCase().includes(filterQuery.toLowerCase()) ||
      facility.locality.toLowerCase().includes(filterQuery.toLowerCase()) ||
      facility.specialities.some(s => s.toLowerCase().includes(filterQuery.toLowerCase()));

    const matchesType =
      facilityTypeFilter === 'All' ||
      (facilityTypeFilter === 'Hospital' && (facility.type === 'Hospital' || facility.type === 'Medical College & Hospital')) ||
      (facilityTypeFilter === 'Nursing Home' && facility.type === 'Nursing Home') ||
      (facilityTypeFilter === 'Diagnostic & Clinic' && facility.type === 'Diagnostic & Clinic');

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="bg-[#E8F5E9] rounded-3xl p-6 sm:p-8 border border-[#D5E8D7] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#2E7D32] font-bold text-xs">
              <Compass className="w-4 h-4 text-[#2E7D32]" />
              <span>Real-Time GPS & Verified Regional Healthcare Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#171717]">
              {language === 'bn' ? 'নিকটস্থ জরুরি হাসপাতাল ও লাইভ বেড ট্র্যাকার' : 'Nearby Hospitals & Emergency Bed Tracker'}
            </h1>
            <p className="text-xs text-[#555555] max-w-2xl">
              {language === 'bn'
                ? 'আপনার লাইভ জিপিএস অবস্থান বা নির্বাচিত এলাকার ভিত্তিতে যাচাইকৃত প্রকৃত হাসপাতাল, জরুরি বেডের সঠিক তথ্য, যোগাযোগের নম্বর ও সরাসরি গুগল ম্যাপস ডিরেকশন।'
                : 'Discover verified healthcare facilities near your GPS coordinates or chosen area with real-time distance calculation, verified emergency beds, and direct calling.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleDetectGps}
              disabled={gpsStatus === 'locating'}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-white border border-[#D5E8D7] hover:bg-[#F1F8F2] text-[#171717] font-bold text-xs transition-all shadow-xs"
            >
              <Navigation className={`w-4 h-4 text-[#2E7D32] ${gpsStatus === 'locating' ? 'animate-spin' : ''}`} />
              <span>{gpsStatus === 'locating' ? 'জিপিএস ট্র্যাকিং...' : 'আমার জিপিএস অবস্থান ব্যবহার করুন'}</span>
            </button>

            <button
              onClick={() => navigateTo('emergency-sos', selectedHospital ? { hospitalId: selectedHospital.id } : undefined)}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs shadow-sm transition-all"
            >
              <AlertOctagon className="w-4 h-4 animate-pulse" />
              <span>{t('openEmergencySos')}</span>
            </button>
          </div>
        </div>

        {/* GPS Status Alerts */}
        {gpsStatus === 'success' && userCoordinates && (
          <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#D5E8D7] text-[#171717] text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-[#2E7D32] animate-pulse shrink-0" />
              <span>
                <strong>লাইভ জিপিএস সক্রিয়:</strong> আপনার অবস্থান অক্ষাংশ {userCoordinates.lat.toFixed(4)}, দ্রাঘিমাংশ {userCoordinates.lng.toFixed(4)} অনুযায়ী নিকটস্থ প্রতিষ্ঠানগুলো সাজানো হয়েছে।
              </span>
            </div>
            <button
              onClick={handleDetectGps}
              className="flex items-center space-x-1 px-3 py-1 bg-white border border-[#D5E8D7] rounded-lg text-[#2E7D32] font-bold text-xs hover:bg-[#F1F8F2]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>রিফ্রেশ করুন</span>
            </button>
          </div>
        )}

        {(gpsStatus === 'denied' || gpsStatus === 'unavailable') && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{gpsErrorMsg}</span>
          </div>
        )}

        {/* Location Search Bar & Suggestions */}
        <div className="bg-[#E8F5E9] rounded-2xl p-5 sm:p-6 border border-[#D5E8D7] shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Location Input */}
            <div className="md:col-span-5 space-y-1">
              <label className="block text-xs font-bold text-[#171717]">
                {language === 'bn' ? 'এলাকা বা শহর অনুসন্ধান (Type Location or Select Suggestion):' : 'Location Area Search:'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#2E7D32] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchLocationInput}
                  onChange={e => setSearchLocationInput(e.target.value)}
                  placeholder="e.g. Panihati, Dum Dum, Sodepur, Belgharia..."
                  className="w-full pl-10 pr-24 py-2.5 bg-white border border-[#D5E8D7] rounded-xl text-xs font-bold text-[#171717] outline-hidden focus:border-[#2E7D32]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Hospital Name / Speciality Filter */}
            <div className="md:col-span-4 space-y-1">
              <label className="block text-xs font-bold text-[#171717]">
                {language === 'bn' ? 'হাসপাতাল বা স্পেশালিটি খুঁজুন:' : 'Search by Name / Facility:'}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#555555] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'bn' ? 'যেমন: সাগর দত্ত, আইসিইউ, কার্ডিওলজি...' : 'e.g. Sagore Dutta, ICU, Eye...'}
                  value={filterQuery}
                  onChange={e => setFilterQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D5E8D7] rounded-xl text-xs focus:border-[#2E7D32] font-medium text-[#171717] outline-hidden"
                />
              </div>
            </div>

            {/* Facility Type Filter */}
            <div className="md:col-span-3 space-y-1">
              <label className="block text-xs font-bold text-[#171717]">
                {language === 'bn' ? 'ধরণ (Facility Type):' : 'Facility Type:'}
              </label>
              <select
                value={facilityTypeFilter}
                onChange={e => setFacilityTypeFilter(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-[#D5E8D7] rounded-xl text-xs font-bold text-[#171717] outline-hidden focus:border-[#2E7D32]"
              >
                <option value="All">সকল প্রতিষ্ঠান (All Facilities)</option>
                <option value="Hospital">হাসপাতাল (Hospitals)</option>
                <option value="Nursing Home">নার্সিং হোম (Nursing Homes)</option>
                <option value="Diagnostic & Clinic">ডায়াগনস্টিক ও ক্লিনিক (Clinics)</option>
              </select>
            </div>
          </form>

          {/* Location Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D5E8D7]">
            <span className="text-[11px] font-bold text-[#555555] mr-1">
              {language === 'bn' ? 'প্রস্তাবিত এলাকা:' : 'Quick Select:'}
            </span>
            {locationSuggestions.map(loc => (
              <button
                key={loc}
                type="button"
                onClick={() => handleManualSearch(loc)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeLocationQuery === loc && gpsStatus !== 'success'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'bg-white hover:bg-[#F1F8F2] border border-[#D5E8D7] text-[#171717]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Interactive Map + Hospital Cards List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Top Hospital Cards Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-base font-black text-[#171717] flex items-center space-x-2">
                <Building className="w-5 h-5 text-[#2E7D32]" />
                <span>
                  {language === 'bn'
                    ? `${activeLocationQuery} অঞ্চলের যাচাইকৃত প্রতিষ্ঠানসমূহ`
                    : `Verified Facilities in ${activeLocationQuery}`}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7]">
                  {filteredHospitals.length}
                </span>
              </h2>

              <span className="text-xs text-[#555555] font-medium">
                {language === 'bn' ? 'নিকটবর্তী ক্রমানুসারে সাজানো' : 'Sorted by distance'}
              </span>
            </div>

            {filteredHospitals.length === 0 ? (
              <div className="bg-[#E8F5E9] rounded-3xl p-12 text-center border border-[#D5E8D7] space-y-3">
                <Building className="w-12 h-12 text-[#2E7D32]/40 mx-auto" />
                <h3 className="text-base font-bold text-[#171717]">কোনো স্বাস্থ্য প্রতিষ্ঠান খুঁজে পাওয়া যায়নি</h3>
                <p className="text-xs text-[#555555] max-w-sm mx-auto">
                  আপনার অনুসন্ধান ফিল্টারের সাথে মিলে এমন কোনো হাসপাতাল এই এলাকায় পাওয়া যায়নি। ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।
                </p>
                <button
                  onClick={() => {
                    setFilterQuery('');
                    setFacilityTypeFilter('All');
                    handleManualSearch('Panihati, West Bengal');
                  }}
                  className="px-4 py-2 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  ডিফল্ট তালিকা দেখুন
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHospitals.map(hosp => {
                  const isSelected = selectedHospital?.id === hosp.id;

                  return (
                    <div
                      key={hosp.id}
                      onClick={() => handleSelectHospital(hosp)}
                      className={`bg-[#E8F5E9] rounded-2xl p-5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2E7D32] shadow-sm ring-2 ring-[#2E7D32]/30'
                          : 'border-[#D5E8D7] shadow-xs hover:border-[#2E7D32] hover:shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-white text-[#171717] text-[11px] font-bold border border-[#D5E8D7]">
                              {hosp.type}
                            </span>
                            {hosp.emergencyAvailable ? (
                              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                                <span>24x7 Emergency Ready</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-white text-[#555555] text-[10px] font-medium border border-[#D5E8D7]">
                                Daycare & OPD
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-black text-[#171717] hover:text-[#2E7D32] transition-colors">
                            {hosp.name}
                          </h3>
                          <p className="text-xs text-[#2E7D32] font-bengali font-bold">{hosp.nameBn}</p>
                          <p className="text-xs text-[#555555]">{hosp.address}</p>
                        </div>

                        {/* Distance Badge */}
                        <div className="text-right shrink-0 bg-white px-3 py-1.5 rounded-xl border border-[#D5E8D7]">
                          <span className="text-base font-black text-[#2E7D32] block">
                            {hosp.distanceKm} km
                          </span>
                          <span className="text-[10px] text-[#555555] font-semibold block">
                            ~{hosp.travelTimeMins} মিনিট (Mins)
                          </span>
                        </div>
                      </div>

                      {/* Emergency Bed Availability Box */}
                      <div className="my-3 p-3 rounded-xl border border-[#D5E8D7] bg-white flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <Bed className="w-4 h-4 text-[#2E7D32] shrink-0" />
                          <span className="font-bold text-[#171717]">জরুরি বেড স্ট্যাটাস:</span>
                          {hosp.isBedVerified ? (
                            <div className="flex items-center space-x-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-md text-xs font-black ${
                                  (hosp.availableBeds ?? 0) > 5
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : (hosp.availableBeds ?? 0) > 0
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {hosp.availableBeds} টি সাধারণ বেড খালি
                              </span>
                              {(hosp.icuBedsAvailable ?? 0) > 0 && (
                                <span className="px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#2E7D32] border border-[#D5E8D7] text-xs font-black">
                                  {hosp.icuBedsAvailable} টি ICU
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[#555555] font-bold text-[11px]">
                              Availability not verified — contact hospital
                            </span>
                          )}
                        </div>

                        {hosp.bedSource && (
                          <div className="text-[10px] text-[#555555] flex items-center space-x-1">
                            <Info className="w-3 h-3 text-[#2E7D32]" />
                            <span>{hosp.bedSource}</span>
                            {hosp.lastBedUpdate && <span>• {hosp.lastBedUpdate}</span>}
                          </div>
                        )}
                      </div>

                      {/* Specialities preview tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {hosp.specialities.slice(0, 4).map((spec, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-white text-[#555555] rounded border border-[#D5E8D7]">
                            {spec}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-[#D5E8D7] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <a
                            href={`tel:${hosp.phone.replace(/[^0-9+]/g, '')}`}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#256B2A] text-white font-bold transition-all shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>কল করুন ({hosp.phone})</span>
                          </a>

                          <a
                            href={hosp.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F1F8F2] border border-[#D5E8D7] text-[#171717] font-bold transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#555555]" />
                            <span>ডিরেকশন (Directions)</span>
                          </a>
                        </div>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleSelectHospital(hosp);
                          }}
                          className="font-bold text-[#2E7D32] hover:underline flex items-center space-x-1"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>ম্যাপে অবস্থান দেখুন</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Sticky Map Column (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="bg-[#E8F5E9] rounded-3xl p-5 border border-[#D5E8D7] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#171717] flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-[#2E7D32]" />
                  <span>লাইভ ইন্টারেক্টিভ রাডার ম্যাপ</span>
                </h3>
                {selectedHospital && (
                  <button
                    onClick={() => setSelectedHospital(null)}
                    className="text-[11px] font-bold text-[#555555] hover:text-[#171717]"
                  >
                    রিসেট জুম
                  </button>
                )}
              </div>

              {/* Leaflet OpenStreetMap View */}
              <div className="h-[420px] w-full rounded-2xl overflow-hidden border border-[#D5E8D7]">
                <HospitalMap
                  hospitals={filteredHospitals}
                  userLocation={userCoordinates}
                  selectedHospital={selectedHospital}
                  onSelectHospital={hosp => setSelectedHospital(hosp)}
                />
              </div>

              {/* Selected Hospital Quick Card */}
              {selectedHospital ? (
                <div className="p-3.5 bg-white border border-[#D5E8D7] rounded-2xl space-y-2 text-xs animate-in fade-in shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-[#171717] text-sm">{selectedHospital.name}</p>
                      <p className="text-[11px] text-[#555555]">{selectedHospital.address}</p>
                    </div>
                    <span className="font-black text-[#2E7D32] shrink-0 bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#D5E8D7]">
                      {selectedHospital.distanceKm} km
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <a
                      href={`tel:${selectedHospital.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex-1 text-center py-1.5 bg-[#2E7D32] hover:bg-[#256B2A] text-white rounded-lg font-bold"
                    >
                      📞 সরাসরি কল করুন
                    </a>
                    <a
                      href={selectedHospital.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-1.5 bg-white border border-[#D5E8D7] hover:bg-[#F1F8F2] text-[#171717] rounded-lg font-bold"
                    >
                      🗺️ গুগল ম্যাপস
                    </a>
                  </div>
                  <button
                    onClick={() => navigateTo('emergency-sos', { hospitalId: selectedHospital.id })}
                    className="w-full mt-2 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-black shadow-sm flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
                    <span>{language === 'bn' ? 'জরুরি চিকিৎসা অনুরোধ পাঠান' : 'Submit Emergency Request'}</span>
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-[#555555] text-center italic">
                  ম্যাপের কোনো পিন বা হাসপাতালের কার্ডে ক্লিক করে বিস্তারিত জানুন।
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
