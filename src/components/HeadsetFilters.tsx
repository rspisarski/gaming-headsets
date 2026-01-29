import { useState, useMemo, useEffect } from 'preact/hooks';
import { HeadsetCard } from './HeadsetCard';

interface HeadsetData {
    slug: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    connection_types: string[];
    platforms: string[];
    microphone_type: string;
    surround_sound: string;
    active_features: string[];
    rgb_lighting: string;
    mic_monitoring: boolean;
    headphone_type: string;
    image_thumbnail_contain?: boolean;
    amazon_product_id?: string;
    amazon_us?: string;
    matchingFeatures?: { label: string; values: string[] }[];
    matchCount?: number;
}

interface Props {
    headsets: HeadsetData[];
}

// Internal Helper Components
interface FilterCheckboxProps {
    label: string;
    value?: string;
    checked: boolean;
    onChange: (e: any) => void;
    size?: "sm" | "xs";
    compact?: boolean;
}

function FilterCheckbox({ label, checked, onChange, size = "xs", compact = true }: FilterCheckboxProps) {
    return (
        <label className={`flex items-center gap-2 cursor-pointer group/item ${compact ? "py-0.5" : "py-1"}`}>
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="peer sr-only"
                />
                <div
                    className={`rounded border border-gray-600 bg-black/50 transition-all duration-200 peer-focus:ring-2 peer-focus:ring-secondary/50 peer-checked:bg-secondary peer-checked:border-secondary peer-checked:shadow-[0_0_10px_rgba(156,68,251,0.3)] flex items-center justify-center group-hover/item:border-secondary/70 ${size === "sm" ? "w-4 h-4" : "w-3.5 h-3.5"
                        }`}
                >
                    <svg
                        className={`text-black opacity-0 peer-checked:opacity-100 transition-opacity duration-200 ${size === "sm" ? "w-3 h-3" : "w-2.5 h-2.5"
                            }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="4"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
            <span className={`text-text/60 group-hover/item:text-text transition-colors select-none ${size === "sm" ? "text-xs" : "text-[11px]"}`}>
                {label}
            </span>
        </label>
    );
}

interface FilterRadioProps {
    label: string;
    value?: string;
    checked: boolean;
    onChange: (e: any) => void;
    name: string;
}

function FilterRadio({ label, checked, onChange, name }: FilterRadioProps) {
    return (
        <label className="flex items-center gap-2 cursor-pointer group/item py-0.5">
            <div className="relative flex items-center">
                <input
                    type="radio"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="peer sr-only"
                />
                <div className="w-3.5 h-3.5 rounded-full border border-gray-600 bg-black/50 transition-all duration-200 peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:bg-primary peer-checked:border-primary peer-checked:shadow-[0_0_8px_rgba(139,213,27,0.3)] flex items-center justify-center group-hover/item:border-primary/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-black opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                </div>
            </div>
            <span className="text-text/60 group-hover/item:text-text text-[11px] select-none transition-colors">
                {label}
            </span>
        </label>
    );
}

export function HeadsetFilters({ headsets }: Props) {
    const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
    const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());
    const [selectedPriceCategories, setSelectedPriceCategories] = useState<Set<string>>(new Set());
    const [selectedMicTypes, setSelectedMicTypes] = useState<Set<string>>(new Set());
    const [selectedSurround, setSelectedSurround] = useState<Set<string>>(new Set());
    const [selectedNC, setSelectedNC] = useState<Set<string>>(new Set());
    const [selectedRGB, setSelectedRGB] = useState<Set<string>>(new Set());
    const [selectedConnectivity, setSelectedConnectivity] = useState<Set<string>>(new Set());
    const [selectedAcoustic, setSelectedAcoustic] = useState<Set<string>>(new Set());
    const [micMonitoring, setMicMonitoring] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [brandShowAll, setBrandShowAll] = useState(false);
    const [platformShowAll, setPlatformShowAll] = useState(false);

    const itemsPerPage = 12;

    const uniqueBrands = useMemo(() => {
        return Array.from(new Set(headsets.map(h => h.brand)))
            .map(brand => ({ name: brand, count: headsets.filter(h => h.brand === brand).length }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
            .map(item => item.name);
    }, [headsets]);

    const uniquePlatforms = useMemo(() => ["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X|S", "Xbox One", "Nintendo Switch", "Mobile"], []);
    const microphoneTypes = useMemo(() => ["Boom Mic", "Retractable Mic", "Detachable Mic", "Inline Mic", "Dual Microphone Array", "No Microphone"], []);
    const surroundSounds = useMemo(() => ["Stereo", "Virtual 5.1", "Virtual 7.1", "True 7.1", "Dolby Atmos", "DTS:X 2.0", "Windows Sonic", "THX Spatial Audio", "Tempest 3D Audio", "Proprietary Spatial"], []);
    const rgbOptions = useMemo(() => ["Customizable RGB", "Reactive Lighting", "No Lighting"], []);

    const priceCategories = ["Budget", "Value", "Mid-range", "Premium", "Flagship"];
    const getPriceCategory = (price: number) => {
        if (price < 75) return "Budget";
        if (price < 150) return "Value";
        if (price < 250) return "Mid-range";
        if (price < 400) return "Premium";
        return "Flagship";
    };

    const isWireless = (types: string[]) => types.some(t => t === "2.4GHz Wireless" || t === "Bluetooth");

    const filteredHeadsets = useMemo(() => {
        const results = headsets.map(headset => {
            const matchGroups: { label: string; values: string[] }[] = [];
            let score = 0;

            const checkMatch = (selected: Set<string>, actual: string | string[], categoryLabel?: string) => {
                if (selected.size === 0) return true;
                const actualArr = Array.isArray(actual) ? actual : [actual];
                const found = Array.from(selected).filter(s => actualArr.includes(s));
                if (found.length > 0) {
                    score += found.length;
                    if (categoryLabel) {
                        matchGroups.push({ label: categoryLabel, values: found });
                    }
                    return true;
                }
                return false;
            };

            // Category matching
            const brandMatch = checkMatch(selectedBrands, headset.brand);
            const platformMatch = checkMatch(selectedPlatforms, headset.platforms, 'Platform');
            const micMatch = checkMatch(selectedMicTypes, headset.microphone_type, 'Mic');
            const surroundMatch = checkMatch(selectedSurround, headset.surround_sound, 'Surround');
            const rgbMatch = checkMatch(selectedRGB, headset.rgb_lighting, 'RGB');

            const priceCat = getPriceCategory(headset.price);
            const priceMatch = checkMatch(selectedPriceCategories, priceCat, 'Price');

            // Special cases
            let connMatch = selectedConnectivity.size === 0;
            if (selectedConnectivity.size > 0) {
                const isHWireless = isWireless(headset.connection_types);
                const foundConn: string[] = [];
                if (selectedConnectivity.has('wireless') && isHWireless) foundConn.push('Wireless');
                if (selectedConnectivity.has('wired') && !isHWireless) foundConn.push('Wired');

                if (foundConn.length > 0) {
                    score += foundConn.length;
                    matchGroups.push({ label: 'Type', values: foundConn });
                    connMatch = true;
                }
            }

            let ncMatch = selectedNC.size === 0;
            if (selectedNC.size > 0) {
                const hasANC = headset.active_features.includes("Active Noise Cancellation");
                const foundNC: string[] = [];
                if (selectedNC.has('Active') && hasANC) foundNC.push('Active NC');
                if (selectedNC.has('None') && !hasANC) foundNC.push('Passive Only');

                if (foundNC.length > 0) {
                    score += foundNC.length;
                    matchGroups.push({ label: 'Noise Cancel', values: foundNC });
                    ncMatch = true;
                }
            }

            let mmMatch = true;
            if (micMonitoring) {
                if (headset.mic_monitoring) {
                    score++;
                    matchGroups.push({ label: 'Features', values: ['Mic Monitoring'] });
                    mmMatch = true;
                } else {
                    mmMatch = false;
                }
            }

            let acousticMatch = checkMatch(selectedAcoustic, headset.headphone_type, 'Acoustic');

            const isVisible = brandMatch && platformMatch && micMatch && surroundMatch && rgbMatch && priceMatch && connMatch && ncMatch && mmMatch && acousticMatch;

            return {
                ...headset,
                isVisible,
                matchCount: score,
                matchingFeatures: matchGroups
            };
        });

        return (results as any[])
            .filter(h => h.isVisible)
            .sort((a, b) => (b.matchCount || 0) - (a.matchCount || 0));
    }, [headsets, selectedBrands, selectedPlatforms, selectedPriceCategories, selectedMicTypes, selectedSurround, selectedNC, selectedRGB, selectedConnectivity, selectedAcoustic, micMonitoring]);

    const paginatedHeadsets = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredHeadsets.slice(start, start + itemsPerPage);
    }, [filteredHeadsets, currentPage]);

    const totalPages = Math.ceil(filteredHeadsets.length / itemsPerPage);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.has('brand')) setSelectedBrands(new Set(params.get('brand')!.split(',')));
        if (params.has('platform')) setSelectedPlatforms(new Set(params.get('platform')!.split(',')));
        if (params.has('price')) setSelectedPriceCategories(new Set(params.get('price')!.split(',')));
        if (params.has('mic')) setSelectedMicTypes(new Set(params.get('mic')!.split(',')));
        if (params.has('surround')) setSelectedSurround(new Set(params.get('surround')!.split(',')));
        if (params.has('nc')) setSelectedNC(new Set(params.get('nc')!.split(',')));
        if (params.has('rgb')) setSelectedRGB(new Set(params.get('rgb')!.split(',')));
        if (params.has('connectivity')) setSelectedConnectivity(new Set(params.get('connectivity')!.split(',')));
        if (params.has('acoustic')) setSelectedAcoustic(new Set(params.get('acoustic')!.split(',')));
        if (params.has('mm')) setMicMonitoring(params.get('mm') === 'true');
        if (params.has('page')) setCurrentPage(parseInt(params.get('page')!));
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedBrands.size > 0) params.set('brand', Array.from(selectedBrands).join(','));
        if (selectedPlatforms.size > 0) params.set('platform', Array.from(selectedPlatforms).join(','));
        if (selectedPriceCategories.size > 0) params.set('price', Array.from(selectedPriceCategories).join(','));
        if (selectedMicTypes.size > 0) params.set('mic', Array.from(selectedMicTypes).join(','));
        if (selectedSurround.size > 0) params.set('surround', Array.from(selectedSurround).join(','));
        if (selectedNC.size > 0) params.set('nc', Array.from(selectedNC).join(','));
        if (selectedRGB.size > 0) params.set('rgb', Array.from(selectedRGB).join(','));
        if (selectedConnectivity.size > 0) params.set('connectivity', Array.from(selectedConnectivity).join(','));
        if (selectedAcoustic.size > 0) params.set('acoustic', Array.from(selectedAcoustic).join(','));
        if (micMonitoring) params.set('mm', 'true');
        if (currentPage > 1) params.set('page', currentPage.toString());

        const newQuery = params.toString() ? `?${params.toString()}` : window.location.pathname;
        window.history.replaceState({}, '', newQuery);
    }, [selectedBrands, selectedPlatforms, selectedPriceCategories, selectedMicTypes, selectedSurround, selectedNC, selectedRGB, selectedConnectivity, selectedAcoustic, micMonitoring, currentPage]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = isMobileFiltersOpen ? 'hidden' : '';
        }
    }, [isMobileFiltersOpen]);


    const toggleSet = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
        const newSet = new Set(set);
        if (newSet.has(val)) newSet.delete(val);
        else newSet.add(val);
        setter(newSet);
        setCurrentPage(1);
    };

    const clearAll = () => {
        setSelectedBrands(new Set());
        setSelectedPlatforms(new Set());
        setSelectedPriceCategories(new Set());
        setSelectedMicTypes(new Set());
        setSelectedSurround(new Set());
        setSelectedRGB(new Set());
        setSelectedNC(new Set());
        setSelectedConnectivity(new Set());
        setSelectedAcoustic(new Set());
        setMicMonitoring(false);
        setCurrentPage(1);
        setIsMobileFiltersOpen(false);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <aside
                className={`fixed inset-0 z-[100] lg:z-0 bg-black/95 backdrop-blur-sm transition-transform duration-300 ${isMobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 lg:static lg:bg-transparent lg:w-64 lg:block lg:flex-shrink-0`}
            >
                <div className="h-full overflow-y-auto lg:h-auto lg:overflow-visible bg-card-bg p-5 lg:rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-text uppercase tracking-tight">Filters</h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearAll}
                                className="text-[10px] font-bold uppercase text-primary hover:text-primary/80 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="lg:hidden text-text/60 hover:text-text transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Price Category */}
                    <div className="mb-4">
                        <h3 className="text-[10px] font-semibold text-text uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Price</h3>
                        <div className="space-y-0.5">
                            {priceCategories.map(cat => (
                                <FilterCheckbox
                                    key={cat}
                                    label={cat}
                                    checked={selectedPriceCategories.has(cat)}
                                    onChange={() => toggleSet(selectedPriceCategories, cat, setSelectedPriceCategories)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Brand */}
                    <div className="mb-4">
                        <h3 className="text-[10px] font-semibold text-text uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Brand</h3>
                        <div className="space-y-0.5">
                            {(brandShowAll ? uniqueBrands : uniqueBrands.slice(0, 5)).map(brand => (
                                <FilterCheckbox
                                    key={brand}
                                    label={brand}
                                    checked={selectedBrands.has(brand)}
                                    onChange={() => toggleSet(selectedBrands, brand, setSelectedBrands)}
                                />
                            ))}
                        </div>
                        {uniqueBrands.length > 5 && (
                            <button
                                onClick={() => setBrandShowAll(!brandShowAll)}
                                className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors mt-1.5 ml-0.5 uppercase tracking-tighter"
                            >
                                {brandShowAll ? 'Less -' : 'More +'}
                            </button>
                        )}
                    </div>

                    {/* Connectivity */}
                    <div className="mb-4">
                        <h3 className="text-[10px] font-semibold text-text uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Type</h3>
                        <div className="space-y-0.5">
                            <FilterCheckbox
                                label="Wireless"
                                checked={selectedConnectivity.has('wireless')}
                                onChange={() => toggleSet(selectedConnectivity, 'wireless', setSelectedConnectivity)}
                            />
                            <FilterCheckbox
                                label="Wired"
                                checked={selectedConnectivity.has('wired')}
                                onChange={() => toggleSet(selectedConnectivity, 'wired', setSelectedConnectivity)}
                            />
                        </div>
                    </div>

                    {/* Acoustic Design */}
                    <div className="mb-4">
                        <h3 className="text-[10px] font-semibold text-text uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Acoustic Design</h3>
                        <div className="space-y-0.5">
                            <FilterCheckbox
                                label="Closed-back"
                                checked={selectedAcoustic.has('Closed-back')}
                                onChange={() => toggleSet(selectedAcoustic, 'Closed-back', setSelectedAcoustic)}
                            />
                            <FilterCheckbox
                                label="Open-back"
                                checked={selectedAcoustic.has('Open-back')}
                                onChange={() => toggleSet(selectedAcoustic, 'Open-back', setSelectedAcoustic)}
                            />
                        </div>
                    </div>

                    {/* Platform */}
                    <div className="mb-5">
                        <h3 className="text-[10px] font-semibold text-text uppercase tracking-widest mb-2 border-b border-white/5 pb-1">Platform</h3>
                        <div className="space-y-0.5">
                            {(platformShowAll ? uniquePlatforms : uniquePlatforms.slice(0, 5)).map(p => (
                                <FilterCheckbox
                                    key={p}
                                    label={p}
                                    checked={selectedPlatforms.has(p)}
                                    onChange={() => toggleSet(selectedPlatforms, p, setSelectedPlatforms)}
                                />
                            ))}
                        </div>
                        {uniquePlatforms.length > 5 && (
                            <button
                                onClick={() => setPlatformShowAll(!platformShowAll)}
                                className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors mt-1.5 ml-0.5 uppercase tracking-tighter"
                            >
                                {platformShowAll ? 'Less -' : 'More +'}
                            </button>
                        )}
                    </div>

                    {/* Advanced Filters */}
                    <details className="mb-4 group/adv">
                        <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 flex items-center bg-primary/5 py-2 px-3 rounded-lg border border-primary/10 transition-colors">
                            <svg className="w-3.5 h-3.5 mr-2 transition-transform group-open/adv:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                            </svg>
                            Advanced
                        </summary>
                        <div className="mt-3 space-y-4 pl-1">
                            <div>
                                <h4 className="text-[9px] font-semibold text-text uppercase tracking-[0.2em] mb-2">Microphone</h4>
                                <div className="space-y-0.5">
                                    {microphoneTypes.map(m => (
                                        <FilterCheckbox
                                            key={m}
                                            label={m}
                                            checked={selectedMicTypes.has(m)}
                                            onChange={() => toggleSet(selectedMicTypes, m, setSelectedMicTypes)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[9px] font-semibold text-text uppercase tracking-[0.2em] mb-2">Surround</h4>
                                <div className="space-y-0.5">
                                    {surroundSounds.map(s => (
                                        <FilterCheckbox
                                            key={s}
                                            label={s}
                                            checked={selectedSurround.has(s)}
                                            onChange={() => toggleSet(selectedSurround, s, setSelectedSurround)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[9px] font-semibold text-text uppercase tracking-[0.2em] mb-2">Noise Cancel</h4>
                                <div className="space-y-0.5">
                                    <FilterCheckbox
                                        label="Active (ANC)"
                                        checked={selectedNC.has('Active')}
                                        onChange={() => toggleSet(selectedNC, 'Active', setSelectedNC)}
                                    />
                                    <FilterCheckbox
                                        label="Passive Only"
                                        checked={selectedNC.has('None')}
                                        onChange={() => toggleSet(selectedNC, 'None', setSelectedNC)}
                                    />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[9px] font-semibold text-text uppercase tracking-[0.2em] mb-2">RGB</h4>
                                <div className="space-y-0.5">
                                    {rgbOptions.map(r => (
                                        <FilterCheckbox
                                            key={r}
                                            label={r}
                                            checked={selectedRGB.has(r)}
                                            onChange={() => toggleSet(selectedRGB, r, setSelectedRGB)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[9px] font-semibold text-text uppercase tracking-[0.2em] mb-2">Features</h4>
                                <div className="space-y-0.5">
                                    <FilterCheckbox
                                        label="Mic Monitoring"
                                        checked={micMonitoring}
                                        onChange={() => {
                                            setMicMonitoring(!micMonitoring);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </details>

                    <div className="mt-6 pt-5 border-t border-gray-800 lg:hidden flex flex-col gap-3">
                        <button
                            onClick={() => setIsMobileFiltersOpen(false)}
                            className="w-full bg-primary text-white font-black uppercase text-xs tracking-widest py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                            Show Results
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1">
                <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md -mx-4 px-4 py-3 mb-6 border-b border-white/10 lg:static lg:bg-transparent lg:border-none lg:p-0 lg:m-0 lg:mb-6 transition-all">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-text lg:text-xl">Headsets</h2>
                            <p className="text-text/60 text-xs mt-0.5">
                                <span>{filteredHeadsets.length}</span> models available
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-text/60 hover:text-text hover:bg-white/10 transition-all"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Filters
                            </button>

                        </div>
                    </div>
                </div>

                {filteredHeadsets.length === 0 ? (
                    <div className="text-center py-20 bg-card-bg rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-xs font-bold uppercase tracking-widest text-text/20">No matching search results</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 relative">
                        {paginatedHeadsets.map(headset => (
                            <div key={headset.slug} className="animate-fadeIn">
                                <HeadsetCard headset={headset} ctaType="details" />
                            </div>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-10 flex justify-center items-center gap-1.5">
                        <button
                            onClick={() => {
                                setCurrentPage(prev => Math.max(1, prev - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="px-3 py-2 bg-card-bg border border-white/5 rounded-lg text-[10px] font-black uppercase text-text/60 hover:text-text hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => {
                            const page = i + 1;
                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setCurrentPage(page);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${currentPage === page ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" : "bg-card-bg text-text/40 hover:text-text/70 border border-white/5"}`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return <span key={i} className="px-1 text-text/20">.</span>;
                            }
                            return null;
                        })}
                        <button
                            onClick={() => {
                                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 bg-card-bg border border-white/5 rounded-lg text-[10px] font-black uppercase text-text/60 hover:text-text hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.2, 0, 0, 1) forwards;
        }
      `}</style>
        </div >
    );
}
