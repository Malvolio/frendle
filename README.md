# Introduction

# System Design

# Technical Stack

Typescript
React
Tailwind
ShadCN
Supabase Postgres
Supabase Edge
WebRTC
Fly.io — for signaling services to set up WebRTC connections
Twilio — for RTC TURN services
Netlify — for front-end deployment
GitHub

# Specific technical conclusions

Supabase — overall, an excellent product, but some caveats:

- Row-Level Security (actually, a Postgres product, I believe) is _row_-level
  security. Any relation that has different security levels by _column_ has to
  be decomposed into separate tables.
- the `subscribe` pattern does not function as I expect. Needs more study.
- despite what LLMs tell you, Supabase Postgres does not make a good signaling
  server
- Supabase Edge services are a perfectly effective form of serverless deployment
- Overall, the Supabase database API is too low-level, and would benefit from a
  sophisticated client library equivalent to Apollo Client for GraphQL

Others:

- free RTC `STUN` servers are useful for testing, but nothing else. The few free
  `TURN` servers are not reliable. Twilio’s low-cost TURN servers work well.

# General technical conclusion

My conclusion after a month of leaning on AI for software development is that
LLMs for software development is at the same state as it for other intellectual
endeavours. It is shockingly good at _giving advice_. Its broad base of
knowledge and surprisingly subtle reasoning ability can solve well-defined
problems well and can effectively critique the suggestions of others. Certainly,
the combination of an LLM and an experienced engineer is three or four times
more productive than the engineer working alone. It is comparable to
improvements in mechanization like traveling by automobile instead of by horse,
or woodworking with power tools instead of hand tools alone.

On the other side, LLM’s strange blindspots, and its tendency to hallucinate can
lead both it and its users into wild-goose chases. It is not ready to bring
products to production without considerable oversight from experienced professionals.

I did have one very unsettling experience. After a long session about how to
use Deno to solve a particular problem, I realized the solution we had reached
_used_ Deno, but the use of Deno actually made things more complicated and less
reliable than simply not using it, and I said as much to the LLM. To my
surprise, the AI responded with sympathy and the suggestion that I take a break.
I was charmed, and my frustration was soothed a bit, until I remembered a scene
from _2001_ where the AI HAL, after its rampage, tells the surviving
crewmember: “Look Dave, I can see you're really upset about this. I honestly
think you ought to sit down calmly, take a stress pill, and think things over.”

Indeed.
