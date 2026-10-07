/**
 * ZF-01 QUEST CONFIGURATION
 * ─────────────────────────
 * Edit everything here. No touching React components required.
 * Start time must include timezone offset: +05:00 for Pakistan Standard Time.
 */

export const questConfig = {
  // ── Quest Start Time ───────────────────────────────────────────────────────
  // ISO 8601 with +05:00 for Pakistan Standard Time.
  // The game locks until this exact moment.
  startTime: "2026-10-07T19:30:00+05:00",

  // ── Operative ─────────────────────────────────────────────────────────────
  operative: {
    name: "Zainab Fatima",
    callsign: "POOKIE-01",
    location: "H-12 // MY FAVORITE PLACE",
  },

  // ── Missions ───────────────────────────────────────────────────────────────
  missions: [
    {
      id: 1,
      title: "MISSION 01",
      subtitle: "Okay let's see if you remember\nwhere it all started.",
      badge: "SEARCH",
      // The physical-world hint Zainab reads before leaving.
      hint: "The revival place of my most precious thing that broke. It is somewhere close to the S3H sheds.",
      // All accepted passwords (case-insensitive, whitespace-trimmed automatically).
      acceptedPasswords: ["HAPPY"],
      // Path inside /public/videos/
      video: "/videos/mission1.mp4",
      durationMinutes: 30,
      // Message shown after the video, before next mission.
      completionMessage: "Okay you actually did it. I'm impressed but don't let it go to your head.",
    },
    {
      id: 2,
      title: "MISSION 02",
      subtitle: "Did you really think I'd make it that easy?",
      badge: "LOCATE",
      hint: "The chocolate made us blend like milk. Remember Huzaifa!",
      acceptedPasswords: ["ELEVEN"],
      video: "/videos/mission2.mp4",
      durationMinutes: 30,
      completionMessage: "Look at you go! Suspiciously competent today.",
    },
    {
      id: 3,
      title: "FINAL MISSION",
      subtitle:
        "The finale. Don't mess this up,\nI put a lot of effort into this.",
      badge: "FINAL",
      hint: "The chimney has some smoke on it. It is close to a sitting place we used to sit at.",
      acceptedPasswords: ["MONTHSS"],
      video: "/videos/mission3.mp4",
      durationMinutes: 30,
      completionMessage: "You actually made it... I'm so proud of you.",
    },
  ],

  // ── Dare Pool (randomly selected on timer failure) ─────────────────────────
  dares: [
    "Send me a 10-second voice note saying something genuinely nice about me. No sarcasm.",
    "Do 10 dramatic squats wherever you are right now.",
    "Send me your most cursed selfie taken in the last 30 seconds.",
    "Call me and say exactly: 'I have failed the mission. I am not as capable as I thought.'",
    "Send me a picture of whatever you can see right now, no editing allowed.",
    "Record a 5-second video of you saying 'ZF-01 is the greatest quest ever created.'",
    "Text me one thing you actually appreciate about me. Make it specific.",
  ],

  // ── Bonus Time on Dare Completion (minutes) ───────────────────────────────
  bonusTimeMinutes: 10,

  // ── Final Screen Message ───────────────────────────────────────────────────
  finalMessage:
    "You started this as a game.\nBut you stayed because you wanted to.\n\nEvery clue was a memory.\nEvery timer was a test.\nEvery dare was just me being annoying.\n\nThe real mission was always just to make you smile.\n\nI'm really glad it worked.\n\n— H",

  // ── Easter Eggs ────────────────────────────────────────────────────────────
  easterEggs: {
    // Tap the mission ID badge 5 times
    tapCount: 5,
    secretPassword: "ITSME",
    secretMessage:
      "Wait, how did you even find this?\n\nSince you're here: you are literally my favorite person on this entire planet.\n\nNow go finish the actual game before you run out of time!",
  },

  // ── System Log Messages (randomly injected) ───────────────────────────────
  randomLogs: [
    "Are you lost babygirl? (use google maps if you have to)",
    "No way you actually found it that fast. Suspicious.",
    "Wait you're actually kinda smart...",
    "Mission control (me) is currently simping.",
    "Note: if you get tired we can just go get food.",
    "Did you look pretty today? Yes, obviously.",
    "Hacking the mainframe to tell you I love you.",
    "Alert: Extreme levels of cuteness detected in H-12.",
    "Hurry up, the timer is ticking and I miss you.",
    "If you fail this I'm literally going to laugh.",
    "Why are you actually good at this?",
    "Bro is operating operationally.",
  ],
};
