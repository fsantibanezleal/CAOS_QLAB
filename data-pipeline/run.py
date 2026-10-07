"""QLab precompute entry point. Run by path: `python data-pipeline/run.py <case> --all`.

QLab declares no package of its own (the engine is `qversus` from PyPI). Running this file puts data-pipeline/
first on sys.path, so the local `pipeline` tooling resolves without an install.
"""

from pipeline.build import main

if __name__ == "__main__":
    main()
