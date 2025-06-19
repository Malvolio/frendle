import React, { useEffect, useState, useRef } from 'react';
import { RoughNotation } from 'react-rough-notation';

interface ImageSection {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    accent: string;
}

const sections: ImageSection[] = [
    {
        id: 'match',
        imageUrl: 'index/match.svg',
        title: 'Match for low-key conversations',
        description: 'We pair you with people who share your vibe. Each session is a short, face-to-face (yes, video!) conversation. Designed to build real connections over time.',
        accent: '#F5E8DF'
    },
    {
        id: 'prompts',
        imageUrl: 'index/prompts.svg',
        title: 'Prompts that go beyond “how’s the weather?”',
        description: 'We help you skip the small talk with fun, thoughtful prompts that deepen with each chat. Inspired by 36 Questions research, our convo guides make it easier to deepen conversations without the awkward silences! The more you talk to someone, the more we help you go a little deeper (but always at your pace).',
        accent: '#CAD8CE'
    },
    {
        id: 'shared',
        imageUrl: 'index/shared.svg',
        title: 'Shared experiences that spark connection',
        description: 'From co-op games to tiny awe-inspiring videos and creative activities, Frendle offers playful ways to connect without pressure. Shared experiences = stronger bonds. And let’s be honest, it’s just more fun that way.',
        accent: '#D0D2D6'
    },
    {
        id: 'time',
        imageUrl: 'index/time.svg',
        title: 'Time-bound, safe, and structured',
        description: 'You pick when you’re free, and we’ll schedule your chats—no pressure, no surprises.Each convo is short and intentional. We take kindness seriously. Read our House Rules to see how we keep things respectful and inclusive.',
        accent: '#F7E5D7'
    },
    {
        id: 'platonic',
        imageUrl: '/index/platonic.svg',
        title: 'Platonic by design',
        description: 'Frendle is built for friendship—not followers, dating, or clout. Everything is designed with trust, boundaries, and belonging in mind. Backed by psychology. Moderated with care. We don’t tolerate harassment or hate, and we work hard to make this a space where everyone feels welcome.',
        accent: '#EEE7DA'
    },
    {
        id: 'member',
        imageUrl: '/index/member.svg',
        title: 'Member-supported, mission-driven',
        description: 'Frendle runs on kindness and a small monthly fee. 45% goes to keeping the platform running smoothly. 55% goes to a charity you choose. Real connections and real impact. That’s the kind of platform we want to be.',
        accent: '#B8C3C4'
    }
];

const ScrollTriggeredImages: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('innovation');
    const sectionsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observers = sectionsRef.current.map((section, index) => {
            if (!section) return null;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(sections[index].id);
                        }
                    });
                },
                {
                    threshold: 0.6,
                    rootMargin: '-100px 0px'
                }
            );

            observer.observe(section);
            return observer;
        });

        return () => {
            observers.forEach((observer) => {
                if (observer) observer.disconnect();
            });
        };
    }, []);

    const activeImage = sections.find(section => section.id === activeSection);

    return (
        <div className="min-h[50vh] ">
            <div className="flex relative m-auto justify-center">
                {/* Content Sections - Left Side */}
                <div className="w-full lg:w-2/5 relative z-10">
                    {sections.map((section, index) => (
                        <section
                            key={section.id}
                            ref={(el) => (sectionsRef.current[index] = el)}
                            className="min-h-screen flex items-center justify-center px-8 lg:px-16"
                        >
                            <div className="max-w-2xl">
                                <div className="mb-8">
                                    {/* <div
                                        className="w-16 h-1 rounded-full mb-6 transition-all duration-700"
                                        style={{ backgroundColor: section.accent }}
                                    ></div> */}
                                    <RoughNotation type="highlight" show={activeSection === section.id} color={section.accent} animationDelay={500} animationDuration={1000}>
                                        <h2 className="font-peachy text-2xl lg:text-3xl font-bold text-[#37251E]  mb-6 leading-tight">
                                            {section.title}
                                        </h2>
                                    </RoughNotation>
                                    <p className="text-xl text-[#37251E] leading-relaxed mb-8">
                                        {section.description}
                                    </p>
                                    {/* <button
                                        className="group inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                    >
                                        Learn More
                                        <svg
                                            className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button> */}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Fixed Image Panel - Right Side */}
                <div className="hidden lg:block lg:w-2/5 sticky left-0 top-12 h-screen">
                    <div className="relative w-full h-full overflow-hidden">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSection === section.id ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                <img
                                    src={section.imageUrl}
                                    alt={section.title}
                                    className="w-full h-full object-fit"
                                />
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-50/20"></div>
                            </div>
                        ))}

                        {/* Floating accent indicator */}
                        <div className="absolute top-8 left-8 z-10">
                            <div
                                className="w-4 h-4 rounded-full transition-all duration-700 shadow-lg"
                                style={{ backgroundColor: activeImage?.accent }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Image Preview */}
            <div className="lg:hidden">
                <div className="sticky top-0 h-64 overflow-hidden">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSection === section.id ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                src={section.imageUrl}
                                alt={section.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/30"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScrollTriggeredImages;