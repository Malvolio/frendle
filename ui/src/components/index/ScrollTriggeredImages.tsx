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
        // accent: '#F5E8DF'
        accent: 'rgba(164, 183, 125, .3)'
    },
    {
        id: 'prompts',
        imageUrl: 'index/prompts.svg',
        title: 'Prompts that go beyond “how’s the weather?”',
        description: 'We help you skip the small talk with fun, thoughtful prompts that deepen with each chat. Inspired by 36 Questions research, our convo guides make it easier to deepen conversations without the awkward silences! The more you talk to someone, the more we help you go a little deeper (but always at your pace).',
        accent: `rgba(245, 204, 129, .8)`
    },
    {
        id: 'shared',
        imageUrl: 'index/shared.svg',
        title: 'Shared experiences that spark connection',
        description: 'From co-op games to tiny awe-inspiring videos and creative activities, Frendle offers playful ways to connect without pressure. Shared experiences = stronger bonds. And let’s be honest, it’s just more fun that way.',
        accent: 'rgba(187, 196, 215, .8)'
    },
    {
        id: 'time',
        imageUrl: 'index/time.svg',
        title: 'Time-bound, safe, and structured',
        description: 'You pick when you’re free, and we’ll schedule your chats—no pressure, no surprises.Each convo is short and intentional. We take kindness seriously. Read our House Rules to see how we keep things respectful and inclusive.',
        accent: 'rgba(224, 164, 227, .4)'
    },
    {
        id: 'platonic',
        imageUrl: '/index/platonic.svg',
        title: 'Platonic by design',
        description: 'Frendle is built for friendship—not followers, dating, or clout. Everything is designed with trust, boundaries, and belonging in mind. Backed by psychology. Moderated with care. We don’t tolerate harassment or hate, and we work hard to make this a space where everyone feels welcome.',
        accent: 'rgba(171, 217, 193, .6)'
    },
    {
        id: 'member',
        imageUrl: '/index/member.svg',
        title: 'Member-supported, mission-driven',
        description: 'Frendle runs on kindness and a small monthly fee. 45% goes to keeping the platform running smoothly. 55% goes to a charity you choose. Real connections and real impact. That’s the kind of platform we want to be.',
        accent: 'rgba(116, 187, 197, .4)'
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
        <div className="min-h[50vh] m-auto  ">

            <div className="flex relative m-auto justify-center flex-col md:flex-row-reverse">

                {/* INITIAL ROW */}


                {/* Content Sections - Left Side */}
                <div className="w-full lg:w-2/5 relative z-10  ">
                    {sections.map((section, index) => (
                        <section
                            key={section.id}
                            ref={(el) => (sectionsRef.current[index] = el)}
                            className="md:min-h-screen flex items-center justify-center px-8 lg:px-16"
                        >
                            <div className="max-w-2xl">
                                <div className="mb-8">
                                    <RoughNotation type="highlight" show={activeSection === section.id} color={section.accent} animationDelay={300} animationDuration={500} multiline={true} >
                                        <h2 className="py-4 font-peachy text-2xl lg:text-5xl font-bold text-[#37251E]  mb-6 leading-tight bg-blend-multiply">
                                            {section.title}
                                        </h2>
                                    </RoughNotation>
                                    <p className="text-xl lg:text-2xl lg:leading-8 text-[#37251E] leading-relaxed mb-8">
                                        {section.description}
                                    </p>

                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Fixed Image Panel - Right Side Desktop */}
                {/* <div className="hidden lg:block lg:w-2/5 md:sticky left-0 top-12 h-screen"> */}
                <div className="hidden lg:block lg:w-2/5 md:sticky md:left-0 md:top-12 md:h-screen">
                    <div className="relative flex-col w-full md:h-full overflow-hidden">

                        {sections.map((section) => (
                            <div
                                key={section.id}
                                className={`md:absolute inset-0 transition-opacity duration-1000 ease-in-out  ${activeSection === section.id ? 'opacity-70' : 'md:opacity-0'
                                    }`}
                            >
                                <img
                                    src={section.imageUrl}
                                    alt={section.title}
                                    className="w-full h-full object-fit mix-blend-multiply "
                                />
                            </div>
                        ))}

                        {/* Floating accent indicator */}
                        <div className="md:absolute top-8 left-8 z-10">
                            <div
                                className="w-4 h-4 rounded-full transition-all duration-700 shadow-lg"
                                style={{ backgroundColor: activeImage?.accent }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ScrollTriggeredImages;