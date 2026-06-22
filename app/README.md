# app/ — backend (DORMANT)

Per the CAOS product archetype (ADR-0057), every repo ships the full folder set and activates only what it
needs. **QLab does not require a backend at the moment.**

The product is static by design: the live lane runs a JavaScript simulator in the visitor's browser, the
heavy work is precomputed offline into committed traces, and the optional real-hardware lane runs **locally**
(tokens stay in the private vault, never on a server). There is no request-time compute, no multi-user
state, and no auth-gated private data — so no FastAPI service is warranted.

This module would be activated only if a future need appears (e.g. brokering live hardware submissions for
visitors, which would also need cost controls and auth) — at which point it follows ADR-0002. Until then it
stays empty on purpose.
