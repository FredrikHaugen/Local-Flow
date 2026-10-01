# Display font

`archivo-extracondensed-800.woff2` is a static instance of **Archivo** (Google Fonts, latin subset)
pinned at `wdth 62, wght 800` — the only cut the site uses. A static instance is ~14 KB, versus ~90 KB
for the variable font with its width axis, which keeps the LCP headline fast.

Copyright 2020 The Archivo Project Authors (https://github.com/Omnibus-Type/Archivo).
Licensed under the SIL Open Font License 1.1 (https://openfontlicense.org).

Regenerate with fontTools:

```py
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
f = instantiateVariableFont(TTFont("Archivo-latin-variable.woff2"), {"wdth": 62, "wght": 800})
f.flavor = "woff2"; f.save("archivo-extracondensed-800.woff2")
```
