"""Aplica la marca de agua de Intenso (círculo #DC015B con la llama blanca)
en la esquina inferior derecha de una foto de producto.

Uso:
    python scripts/apply_watermark.py <entrada> <salida.png> [<entrada> <salida.png> ...]

El sello se arma a partir de src/assets/flame-icon-white.png, que es el
negativo de la marca (disco blanco con la llama calada): se dibuja un disco
blanco y encima se pinta el rosa usando el alpha del ícono, así la llama queda
blanca con los mismos bordes que el resto del catálogo.

Proporciones medidas sobre las fotos actuales de 1400x1400 px:
diámetro ~15% del lado menor y margen ~2,4% del lado menor.
"""

import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
ICON = ROOT / "src" / "assets" / "flame-icon-white.png"
BRAND = (220, 1, 91, 255)  # #DC015B
DIAMETER_RATIO = 0.151
MARGIN_RATIO = 0.0236


def build_stamp(diameter: int) -> Image.Image:
    icon = Image.open(ICON).convert("RGBA")
    box = icon.getchannel("A").point(lambda v: 255 if v > 128 else 0).getbbox()
    icon = icon.crop(box)

    disc = _disc(icon.width, inset=0.0)
    # La llama es lo que el ícono deja transparente dentro del disco. Se usa
    # un disco apenas más chico para que el borde exterior quede rosa puro.
    flame = ImageChops.subtract(_disc(icon.width, inset=0.04), icon.getchannel("A"))

    stamp = Image.new("RGBA", icon.size, (0, 0, 0, 0))
    stamp.paste(BRAND, (0, 0), disc)
    stamp.paste((255, 255, 255, 255), (0, 0), flame)
    return stamp.resize((diameter, diameter), Image.LANCZOS)


def _disc(size: int, inset: float) -> Image.Image:
    big = size * 4
    pad = round(big * inset)
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).ellipse((pad, pad, big - 1 - pad, big - 1 - pad), fill=255)
    return mask.resize((size, size), Image.LANCZOS)


def apply(src: Path, dest: Path) -> None:
    photo = Image.open(src).convert("RGBA")
    side = min(photo.size)
    diameter = round(side * DIAMETER_RATIO)
    margin = round(side * MARGIN_RATIO)
    stamp = build_stamp(diameter)
    pos = (photo.width - margin - diameter, photo.height - margin - diameter)
    photo.alpha_composite(stamp, pos)
    dest.parent.mkdir(parents=True, exist_ok=True)
    photo.save(dest, optimize=True)


def main(argv: list[str]) -> int:
    if len(argv) < 2 or len(argv) % 2:
        print(__doc__)
        return 1
    for src, dest in zip(argv[0::2], argv[1::2]):
        apply(Path(src), Path(dest))
        print(f"ok  {dest}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
