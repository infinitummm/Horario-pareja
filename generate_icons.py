import os
from PIL import Image, ImageDraw

DIR = r"C:\Users\Admin\.gemini\antigravity\scratch\horario_pareja"
ICON_192 = os.path.join(DIR, "icon-192.png")
ICON_512 = os.path.join(DIR, "icon-512.png")

def create_app_icon(size, path):
    img = Image.new("RGB", (size, size), (253, 242, 248)) # pastel pink
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    r_outer = int(size * 0.42)
    
    # Heart shape accent
    draw.ellipse([center - r_outer, center - r_outer, center + r_outer, center + r_outer], fill=(244, 63, 94))
    
    # Inner circle
    r_inner = int(size * 0.35)
    draw.ellipse([center - r_inner, center - r_inner, center + r_inner, center + r_inner], fill=(255, 255, 255))
    
    # Draw simple double heart inside
    h_w = int(size * 0.15)
    draw.ellipse([center - h_w - 5, center - h_w//2, center + 5, center + h_w//2], fill=(244, 63, 94))
    draw.ellipse([center - 5, center - h_w//2, center + h_w + 5, center + h_w//2], fill=(236, 72, 153))

    img.save(path, "PNG")
    print(f"Generated Duo icon size {size} at {path}")

if __name__ == "__main__":
    create_app_icon(192, ICON_192)
    create_app_icon(512, ICON_512)
    print("Duo Icons successfully generated!")
