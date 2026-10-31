# Loop de op-art psicodélico nas cores do site (referência: os pins de op-art do Herick).
# Tudo calculado, nada copiado: anéis ondulados que respiram e giram, em loop perfeito.
import numpy as np, subprocess, sys
W, H, FPS, SEG = 960, 540, 30, 8
N = FPS * SEG
INK = np.array([20, 20, 20]); PAPER = np.array([239, 233, 218]); RED = np.array([232, 67, 46]); PURPLE = np.array([118, 91, 167]); LAV = np.array([166, 139, 230])
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
x = (x - W * 0.5) / H; y = (y - H * 0.5) / H
r = np.sqrt(x * x + y * y); a = np.arctan2(y, x)
out = sys.argv[1]
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
for i in range(N):
    t = 2 * np.pi * i / N
    rw = r * (1 + 0.16 * np.sin(5 * a + t) + 0.05 * np.sin(3 * a - 2 * t)) + 0.035 * np.sin(9 * r - t)
    fase = rw * 46 - 4 * t
    banda = np.floor(fase / np.pi).astype(np.int32)   # índice do anel
    listra = (banda % 2 == 0)
    img = np.where(listra[..., None], INK, PAPER).astype(np.float32)
    # a cada 5 anéis, um anel colorido (vermelho, roxo, lavanda), girando junto
    cor = banda % 14
    img = np.where((cor == 6)[..., None], RED, img)
    img = np.where((cor == 12)[..., None], PURPLE, img)
    img = np.where(((cor == 13) & (r > 0.45))[..., None], LAV, img)
    # bordas suaves: antialias barato pela distância até a borda do anel
    d = np.abs(np.sin(fase))
    img = img * np.clip(d * 3.2, 0.6, 1)[..., None] + INK * (1 - np.clip(d * 3.2, 0.6, 1))[..., None]
    # miolo vermelho
    img = np.where((r < 0.035 + 0.008 * np.sin(2 * t))[..., None], RED, img)
    # vinheta para fundir com o fundo preto
    v = np.clip(1.25 - r * 0.9, 0, 1)[..., None]
    img = img * v + INK * (1 - v)
    ff.stdin.write(np.clip(img, 0, 255).astype(np.uint8).tobytes())
ff.stdin.close(); ff.wait()
