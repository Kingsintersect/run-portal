import { Book, Atom, Globe, Code, Microscope, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const programs = [
    {
        title: "Computer Science",
        description: "Explore cutting-edge technology and software development",
        icon: Code,
    },
    {
        title: "Business Administration",
        description: "Develop leadership skills for the modern business world",
        icon: Briefcase,
    },
    {
        title: "Biology",
        description: "Discover the science of life through innovative research",
        icon: Microscope,
    },
    {
        title: "Literature",
        description: "Analyze great works and develop critical thinking skills",
        icon: Book,
    },
    {
        title: "Physics",
        description: "Understand the fundamental laws that govern our universe",
        icon: Atom,
    },
    {
        title: "International Relations",
        description: "Study global politics and cross-cultural communication",
        icon: Globe,
    },
];

export default function FeaturedPrograms() {
    return (
        <section className="py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#23608c] mb-4">Featured Academic Programs</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover our diverse range of programs designed to prepare you for success in your chosen field.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow border-t-2 border-t-[#d25400]">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <div className="bg-[#23608c]/10 p-2 rounded-md">
                                <program.icon className="h-6 w-6 text-[#23608c]" />
                            </div>
                            <CardTitle className="text-lg font-medium">{program.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{program.description}</CardDescription>
                            <Link
                                href="#"
                                className="mt-4 inline-block text-[#d25400] font-medium hover:text-[#b34800] transition-colors"
                            >
                                Learn more →
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}