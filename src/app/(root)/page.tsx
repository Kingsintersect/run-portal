import Announcements from "@/components/Announcements";
import CampusHighlights from "@/components/CampusHighlights";
import FeaturedPrograms from "@/components/FeaturedPrograms";
import HeroCarousel from "@/components/HeroCarousel";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function Home() {
	return (
		<main className="min-h-screen">
			<HeroCarousel />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<FeaturedPrograms />
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
					<div className="lg:col-span-2">
						<Announcements />
					</div>
					<div>
						<UpcomingEvents />
					</div>
				</div>
				<CampusHighlights />
			</div>
		</main>
	);
}
