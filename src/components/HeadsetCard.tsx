import { useState, useEffect } from 'preact/hooks';
import { FaAmazon } from 'react-icons/fa6';
import settings from "../data/settings.json";

interface HeadsetData {
    slug: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    amazon_product_id?: string;
    amazon_us?: string;
    image_thumbnail_contain?: boolean;
    connection_types?: string[];
    matchingFeatures?: { label: string; values: string[] }[];
}

interface Props {
    headset: HeadsetData;
    ctaType?: "details" | "amazon";
}

export function HeadsetCard({ headset, ctaType = "details" }: Props) {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        // Sync with global favorites on mount
        const favorites = JSON.parse(localStorage.getItem("headsetFavorites") || "[]");
        setIsFavorite(favorites.includes(headset.slug));
    }, [headset.slug]);

    const toggleFavorite = (e: MouseEvent | any) => {
        e.preventDefault();
        e.stopPropagation();

        let favorites = JSON.parse(localStorage.getItem("headsetFavorites") || "[]");
        if (favorites.includes(headset.slug)) {
            favorites = favorites.filter((s: string) => s !== headset.slug);
            setIsFavorite(false);
        } else {
            favorites.push(headset.slug);
            setIsFavorite(true);
        }
        localStorage.setItem("headsetFavorites", JSON.stringify(favorites));

        // Dispatch event to update other components (like Favorites page)
        window.dispatchEvent(new CustomEvent('favorites-updated'));
    };

    const amazonUrl = headset.amazon_product_id
        ? `https://www.amazon.com/dp/${headset.amazon_product_id}?tag=${settings.amazon_tracking_id}`
        : headset.amazon_us
            ? `${headset.amazon_us}${headset.amazon_us.includes("?") ? "&" : "?"}tag=${settings.amazon_tracking_id}`
            : "#";

    if (!headset) return null;


    return (
        <div className="group bg-card-bg relative z-0 hover:z-10 rounded-xl shadow-sm hover:shadow-[0_0_80px_rgba(139,213,27,0.4)] transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Image - Aspect Ratio 4:3 */}
            <div className={`relative w-full aspect-[4/3] bg-white overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 ${headset.image_thumbnail_contain ? "p-4" : "p-0"}`}>
                <img
                    src={headset.image}
                    alt={`${headset.brand} ${headset.name} gaming headset`}
                    className={`w-full h-full ${headset.image_thumbnail_contain ? "object-contain" : "object-cover"}`}
                    loading="lazy"
                />
            </div>

            <div className="p-5 flex flex-col flex-1">
                {/* Header */}
                <div className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold tracking-wider text-primary uppercase">
                            {headset.brand}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-text leading-tight transition-colors">
                        {headset.name}
                    </h3>
                    {headset.matchingFeatures && headset.matchingFeatures.length > 0 && (
                        <div className="mt-4 space-y-2 border-t border-white/5 pt-3">
                            {headset.matchingFeatures.map((group, idx) => (
                                <div key={group.label} className={`flex justify-between items-start gap-4 ${idx !== 0 ? "pt-2 border-t border-white/5" : ""}`}>
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap pt-1">{group.label}:</span>
                                    <div className="flex flex-wrap justify-end gap-1 flex-1">
                                        {group.values.map(val => (
                                            <span key={val} className="px-1.5 py-0.5 bg-secondary text-white text-[9px] font-bold uppercase tracking-tight rounded border border-secondary shadow-sm">
                                                {val}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1"></div>

                {/* Actions */}
                <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                    {ctaType === "details" ? (
                        <>
                            <a
                                href={`/headsets/${headset.slug}`}
                                className="flex-1 text-center px-4 py-2 bg-primary hover:bg-primary/80 text-black text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                            >
                                View Details
                            </a>
                            <button
                                onClick={toggleFavorite}
                                className={`p-2 transition-all rounded-lg ${isFavorite ? "text-red-400 bg-red-400/10" : "text-text/60 hover:text-red-400 hover:bg-gray-800"}`}
                                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill={isFavorite ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <a
                            href={amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="flex-1 inline-flex items-center justify-center gap-2 text-center px-4 py-3 bg-[#FF9900] hover:bg-[#FF9900]/90 text-black rounded-lg transition-all duration-200"
                        >
                            <FaAmazon size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">
                                Check Price on Amazon
                            </span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
