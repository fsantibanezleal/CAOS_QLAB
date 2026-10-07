# 03 · The real-hardware lane (optional, opt-in): 03 · Costs (the honest reality)

## Costs (the honest reality)

See [../../state-of-the-art.md](../../state-of-the-art.md) §5 for the full table. Short version:

- **$0:** IBM Open (~10 min/month real hardware) + unlimited local simulation. Enough for Bell/GHZ, small
  VQE/QAOA, a real noise demo.
- **~$20–50/month:** mostly a managed notebook (qBraid) + dozens–hundreds of **superconducting**-QPU
  circuits (IQM/Rigetti via Braket, ~$1.2–1.75 per 1000-shot circuit). **Effectively no ion-trap time.**
- **Enterprise:** ion-trap at scale (IonQ/Quantinuum), reserved time, optimization loops on hardware.

**Never** point casual use at ion-trap (IonQ Aria via Azure has a **$97.50 minimum per program**). Azure's
**$500 one-time credit** is best spent as a single "feel a real ion-trap result once" treat.

Back to [03 · The real-hardware lane (optional, opt-in)](../03_real-hardware-lane.md).
