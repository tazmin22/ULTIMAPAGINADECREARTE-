#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageOps, ImageSequence

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'creaerte page'

IMAGE_SUFFIXES = {'.jpg', '.jpeg', '.png', '.gif'}
TEXT_SUFFIXES = {'.html', '.css', '.js', '.md', '.txt', '.json', '.xml'}

LOSSY_QUALITY = 82
ANIM_QUALITY = 80
LOSSLESS_PNG_THRESHOLD = 900_000
LOSSLESS_NAME_HINTS = ('qr', 'logo', 'mano', 'cuadro')


def is_image(path: Path) -> bool:
    return path.is_file() and path.suffix.lower() in IMAGE_SUFFIXES


def likely_lossless(path: Path, im: Image.Image) -> bool:
    name = path.name.lower()
    if any(hint in name for hint in LOSSLESS_NAME_HINTS):
        return True
    if im.mode in {'RGBA', 'LA'}:
        return True
    if im.info.get('transparency') is not None:
        return True
    if path.suffix.lower() == '.png' and path.stat().st_size <= LOSSLESS_PNG_THRESHOLD:
        return True
    return False


def save_static_webp(src: Path, dst: Path) -> None:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        icc = im.info.get('icc_profile')
        lossless = likely_lossless(src, im)

        if lossless:
            if im.mode not in {'RGB', 'RGBA', 'LA', 'P'}:
                im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
            if im.mode == 'P':
                im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
            im.save(dst, format='WEBP', lossless=True, method=6, icc_profile=icc)
            return

        im = im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
        im.save(dst, format='WEBP', quality=LOSSY_QUALITY, method=6, icc_profile=icc)


def save_animated_webp(src: Path, dst: Path) -> None:
    with Image.open(src) as im:
        icc = im.info.get('icc_profile')
        loop = im.info.get('loop', 0)
        duration = im.info.get('duration', 40)

        iterator = iter(ImageSequence.Iterator(im))
        first = next(iterator).copy()
        first = ImageOps.exif_transpose(first).convert('RGBA')

        def rest_frames():
            for frame in iterator:
                yield ImageOps.exif_transpose(frame).convert('RGBA')

        first.save(
            dst,
            format='WEBP',
            save_all=True,
            append_images=rest_frames(),
            duration=duration,
            loop=loop,
            quality=ANIM_QUALITY,
            method=6,
            icc_profile=icc,
        )


def convert_one(src: Path):
    dst = src.with_suffix('.webp')
    src_size = src.stat().st_size
    existing_size = dst.stat().st_size if dst.exists() else None

    if existing_size is not None and existing_size < src_size:
        return src_size, existing_size

    tmp = dst.with_name(dst.name + '.tmp')
    if tmp.exists():
        tmp.unlink()

    try:
        with Image.open(src) as im:
            animated = getattr(im, 'n_frames', 1) > 1
        if animated:
            save_animated_webp(src, tmp)
        else:
            save_static_webp(src, tmp)
    except Exception as exc:
        if tmp.exists():
            tmp.unlink()
        print(f'SKIP\t{src.relative_to(SITE)}\t{exc}')
        return None

    tmp_size = tmp.stat().st_size
    if tmp_size < src_size and (existing_size is None or tmp_size < existing_size):
        tmp.replace(dst)
        return src_size, tmp_size

    if tmp.exists():
        tmp.unlink()
    if existing_size is not None and existing_size >= src_size and dst.exists():
        dst.unlink()
    return None


def convert_images():
    converted = []
    for src in sorted(SITE.rglob('*')):
        if is_image(src) and src.suffix.lower() != '.webp':
            result = convert_one(src)
            if result:
                before, after = result
                converted.append((str(src.relative_to(SITE)), before, after))
    return converted


def replace_text_refs():
    image_ref_re = re.compile(r'''(?P<path>[^"'()\r\n<>]+?\.(?:jpe?g|png|gif|JPE?G|PNG|GIF))''')

    text_files = []
    for src in sorted(ROOT.rglob('*')):
        if not src.is_file():
            continue
        if '.git' in src.parts:
            continue
        if src.suffix.lower() in {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.mkv'}:
            continue
        if src.name.endswith('.html-test') or src.suffix.lower() in TEXT_SUFFIXES:
            text_files.append(src)

    replaced = []
    for path in text_files:
        try:
            original = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue

        def repl(match: re.Match[str]) -> str:
            raw = match.group('path')
            normalized = re.sub(r'\\(.)', r'\1', raw)
            candidate = (SITE / normalized).with_suffix('.webp')
            if candidate.exists():
                return raw.rsplit('.', 1)[0] + '.webp'
            return raw

        updated = image_ref_re.sub(repl, original)
        updated = updated.replace('./img/LOGO.webp', './img/LOGO.png')
        updated = updated.replace('img/LOGO.webp', 'img/LOGO.png')
        if updated != original:
            path.write_text(updated, encoding='utf-8')
            replaced.append(str(path.relative_to(ROOT)))
    return replaced


def main() -> None:
    converted = convert_images()
    print(f'CONVERTED\t{len(converted)}')
    for rel, before, after in converted:
        print(f'{rel}\t{before}\t{after}\t{before - after}')

    replaced = replace_text_refs()
    print(f'REPLACED\t{len(replaced)}')
    for rel in replaced:
        print(rel)


if __name__ == '__main__':
    main()
