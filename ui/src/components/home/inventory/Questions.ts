import { Question } from "./questionnaire";

export const Questions: Question[] = [
  {
    id: "1",
    text: "What’s your ideal weekend?",
    options: [
      {
        id: "1",
        text: "A quiet book, blanket, and maybe a cat or two",
        alt: "gentleman sitting on a blanket reading a book flanked by cats",
      },
      {
        id: "2",
        text: "Brunch with friends, a hike, and spontaneous karaoke",
        alt: "a picnic lunch on a mountain trail on top of a blanket and next to it is a handheld microphone",
      },
      {
        id: "3",
        text: "A side project, some coffee, and a solid to-do list",
        alt: "a coffee cup on a table leaning against the cup is a TODO list with a couple of items checked off",
      },
      {
        id: "4",
        text: "No idea—I’ll figure it out when I get there!",
        alt: "a busy weekly planner with Saturday and Sunday circled with no plans and a big question mark on them",
      },
    ],
  },
  {
    id: "2",
    text: "How do you handle a curveball at work or school?",
    options: [
      {
        id: "1",
        text: "I take a beat, regroup, and solve it",
        alt: "Fred the friendly goose in a zen pose",
      },
      {
        id: "2",
        text: "I panic... and then I solve it",
        alt: "Fred the friendly goose panicked",
      },
      {
        id: "3",
        text: "I had a backup plan for the backup plan",
        alt: "Fred the friendly goose surrounded by plans",
      },
      {
        id: "4",
        text: "I improvise like it’s jazz, baby",
        alt: "Fred the friendly goose grooving to Jazz",
      },
    ],
  },
  {
    id: "3",
    text: "Your desktop looks like:",
    options: [
      {
        id: "1",
        text: "One folder labeled “Stuff” with 873 items inside",
        alt: 'A black-and-white cartoon drawing of an overstuffed file folder labeled "STUFF," with papers comically overflowing in all directions and a whimsical, sketchy style.',
      },
      {
        id: "2",
        text: "Color-coded folders. It’s basically art.",
        alt: "A cartoon-style black-and-white drawing of three perfectly organized file folders in a neat row, each with a different tab position and outlined in wobbly, playful lines.",
      },
      {
        id: "3",
        text: "A chaotic mess, but I know where everything is",
        alt: "A cartoon-style black-and-white drawing of a messy desk with scattered papers, a tilted laptop, a steaming coffee mug, and a cup filled with pencils and pens, all drawn with playful, wobbly lines.",
      },
      {
        id: "4",
        text: "Minimalist. Like, Zen-level empty.",
        alt: "A cartoon-style black-and-white drawing of an organized desk with a coffee mug, a single paper and pencil, an open laptop, and a cup holding pens and pencils, all arranged neatly with wobbly, playful lines.",
      },
    ],
  },
  {
    id: "4",
    text: "How do you usually make decisions?",
    options: [
      {
        id: "1",
        text: "Gut instinct—go with the flow",
        alt: 'A cartoon-style black-and-white drawing of Fred the goose with one wing on his round belly and the other on his beak, eyes closed and smiling, as if thoughtfully "listening to his gut."',
      },
      {
        id: "2",
        text: "Pros and cons list, every time",
        alt: 'A hand-drawn black-and-white cartoon of a paper with "PROS AND CONS" at the top and two columns labeled "PROS" and "CONS," each with short lines representing list items, drawn with wobbly, playful lines.',
      },
      {
        id: "3",
        text: "I ask 3 friends, 2 coworkers, and maybe a magic 8-ball",
        alt: "A cartoon-style black-and-white drawing of a Magic 8-Ball next to a mobile phone showing a goose friend on a call, with signal bars and call icon, all drawn with playful, sketchy lines.",
      },
      {
        id: "4",
        text: "Depends—some things are vibes, others need spreadsheets",
      },
    ],
  },
  {
    id: "5",
    text: "What’s your idea of a great collaboration?",
    options: [
      { id: "1", text: "We brainstorm like mad scientists" },
      { id: "2", text: "We each have roles and stick to them" },
      { id: "3", text: "We vibe and wing it together" },
      { id: "4", text: "We challenge each other and grow" },
    ],
  },
  {
    id: "6",
    text: "How do you recharge?",
    options: [
      { id: "1", text: "Total silence. Maybe a nap." },
      { id: "2", text: "Going out or calling a friend" },
      { id: "3", text: "Working on something just for me" },
      { id: "4", text: "Something completely new—shake it up!" },
    ],
  },
  {
    id: "7",
    text: "What motivates you most?",
    options: [
      { id: "1", text: "Solving problems" },
      { id: "2", text: "Making people happy" },
      { id: "3", text: "Mastering something" },
      { id: "4", text: "Doing things no one’s done before" },
    ],
  },
  {
    id: "8",
    text: "Someone interrupts your workflow—how do you react?",
    options: [
      { id: "1", text: "I’m flustered but polite" },
      { id: "2", text: "I welcome the break" },
      { id: "3", text: "I pretend it’s fine, then fume quietly" },
      { id: "4", text: "I reroute and keep rolling" },
    ],
  },
  {
    id: "9",
    text: "If you were a weather pattern, you'd be:",
    options: [
      { id: "1", text: "Calm and steady—like a spring breeze" },
      { id: "2", text: "Sunny with the occasional thunderclap" },
      {
        id: "3",
        text: "Lightning storm—brilliant, intense, a little chaotic",
      },
      { id: "4", text: "Changing every five minutes, but never boring" },
    ],
  },
  {
    id: "10",
    text: "Pick a motto:",
    options: [
      { id: "10A", text: "“Keep it weird.”" },
      { id: "10B", text: "“Plan the work, work the plan.”" },
      { id: "10C", text: "“Let’s figure it out together.”" },
      { id: "10D", text: "“No risk, no story.”" },
    ],
  },
];
