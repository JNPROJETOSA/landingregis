# -*- coding: utf-8 -*-
"""Gera a apresentação 'Patos Gordinhos' (.pptx)"""
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

# Paleta de cores
AMARELO   = RGBColor(0xFF, 0xD2, 0x4D)
AMARELO_F = RGBColor(0xFF, 0xE9, 0xA8)
LARANJA    = RGBColor(0xFF, 0x8C, 0x2E)
AZUL_BG    = RGBColor(0xEA, 0xF6, 0xFF)
AZUL_TEXTO = RGBColor(0x2C, 0x7F, 0xB8)
CINZA      = RGBColor(0x44, 0x44, 0x44)
BRANCO     = RGBColor(0xFF, 0xFF, 0xFF)

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]
W = prs.slide_width
H = prs.slide_height


def add_bg(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, W, H)
    bg.fill.solid()
    bg.fill.fore_color.rgb = AZUL_BG
    bg.line.fill.background()
    return bg


def add_sun(slide, x=Inches(11.5), y=Inches(0.6)):
    sun = slide.shapes.add_shape(MSO_SHAPE.OVAL, x, y, Inches(1.1), Inches(1.1))
    sun.fill.solid()
    sun.fill.fore_color.rgb = RGBColor(0xFF, 0xF3, 0xB0)
    sun.line.fill.background()
    return sun


def add_duck(slide, x, y, size=Inches(3.0)):
    """Desenha um pato gordinho com formas elípticas. x,y = canto superior esquerdo."""
    s = int(size)
    w, h = int(s * 1.05), int(s * 0.95)
    box = slide.shapes.add_shape(MSO_SHAPE.OVAL, x, y, w, h)
    box.fill.solid()
    box.fill.fore_color.rgb = AMARELO
    box.line.color.rgb = RGBColor(0xE0, 0xA9, 0x2E)
    box.line.width = Pt(2)

    # barriga
    bx, by = x + s // 3, y + s // 3
    bw, bh = int(s * 0.5), int(s * 0.4)
    belly = slide.shapes.add_shape(MSO_SHAPE.OVAL, bx, by, bw, bh)
    belly.fill.solid()
    belly.fill.fore_color.rgb = AMARELO_F
    belly.line.fill.background()

    # cabeça
    hw = int(s * 0.42)
    head = slide.shapes.add_shape(MSO_SHAPE.OVAL, x - s // 10, y - s // 14, hw, hw)
    head.fill.solid()
    head.fill.fore_color.rgb = AMARELO
    head.line.color.rgb = RGBColor(0xE0, 0xA9, 0x2E)
    head.line.width = Pt(2)

    # bico
    bw2 = int(s * 0.30)
    beak = slide.shapes.add_shape(MSO_SHAPE.OVAL, x - int(s * 0.22), y + int(s * 0.08), bw2, int(bw2 * 0.5))
    beak.fill.solid()
    beak.fill.fore_color.rgb = LARANJA
    beak.line.fill.background()

    # olho
    ew = int(s * 0.08)
    eye = slide.shapes.add_shape(MSO_SHAPE.OVAL, x + int(s * 0.14), y + int(s * 0.02), ew, ew)
    eye.fill.solid()
    eye.fill.fore_color.rgb = CINZA
    eye.line.fill.background()


def add_title_box(slide, text, x=Inches(0.7), y=Inches(0.5), size=40, color=AZUL_TEXTO, bold=True):
    tb = slide.shapes.add_textbox(x, y, Inches(9), Inches(1.2))
    p = tb.text_frame.paragraphs[0]
    p.text = text
    p.font.size = Pt(size)
    p.font.bold = bold
    p.font.color.rgb = color
    p.font.name = "Calibri"
    return tb


def add_body_text(slide, lines, x=Inches(0.9), y=Inches(1.9), size=20, w=Inches(7.5), color=CINZA):
    tb = slide.shapes.add_textbox(x, y, w, Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.size = Pt(size)
        p.font.color.rgb = color
        p.font.name = "Calibri"
        p.space_after = Pt(10)
    return tb


def new_slide():
    s = prs.slides.add_slide(BLANK)
    add_bg(s)
    add_sun(s)
    return s


# ============ SLIDE 1: CAPA ============
s = new_slide()
add_title_box(s, "Patos Gordinhos 🐣", x=Inches(0.7), y=Inches(1.5), size=60, color=AZUL_TEXTO)
tb = s.shapes.add_textbox(Inches(0.7), Inches(3.0), Inches(8), Inches(0.8))
p = tb.text_frame.paragraphs[0]
p.text = "Uma apresentação sobre os patos mais cheios de carisma"
p.font.size = Pt(24)
p.font.color.rgb = CINZA
add_duck(s, Inches(8.5), Inches(3.8), size=Inches(3.2))

# ============ SLIDE 2: O QUE É ============
s = new_slide()
add_title_box(s, "O que é um Pato Gordinho?")
add_body_text(s, [
    "• Um pato com aparência arredondada e volumosa.",
    "• Corpo fofo, barriga proeminente e expressões fofinhas.",
    "• Não é uma espécie — é um estilo de vida.",
    "• Famoso por nadar com dificuldade e comer com entusiasmo.",
])

# ============ SLIDE 3: ESPÉCIES FAMOSAS ============
s = new_slide()
add_title_box(s, "Espécies que Tendem a Engordar")
add_body_text(s, [
    "• Pato-real (Mallard) — clássico e bem alimentado em parques.",
    "• Pato-do-papo (Eider) — plumagem espessa que o deixa arredondado.",
    "• Pato-do-rio (Wigeon) — mais compacto e levinho.",
    "• Pato-convictor (Chileno) — o mais gordinho de todos!",
    "• Pato de estimação — quando você compra pão, é ele o responsável.",
])

# ============ SLIDE 4: POR QUE GORDINHOS? ============
s = new_slide()
add_title_box(s, "Por Que Ficam Gordinhos?")
add_body_text(s, [
    "• Dieta rica em pão e ração de parque.",
    "• Sedentarismo — nada quando dá preguiça.",
    "• Genética familiar de patos cheios de si.",
    "• A vida é boa, e eles comem para celebrar.",
])

# ============ SLIDE 5: COMPORTAMENTO ============
s = new_slide()
add_title_box(s, "Comportamento Distintivo")
add_body_text(s, [
    "• Nada em ritmo lento, com dignidade.",
    "• Emite 'quá-quá' em tom dramático.",
    "• Dorme muito — até 14 horas por dia.",
    "• Tem dificuldade para voar (mas tenta).",
    "• Forma amizades em grupo de 3 a 5 gordinhos.",
])

# ============ SLIDE 6: NO MUNDO ============
s = new_slide()
add_title_box(s, "Patos Gordinhos no Mundo")
add_body_text(s, [
    "• Londres — gordinhos no Hyde Park e no lago do Somerset House.",
    "• Paris — o Estação de Waterloo é a capital do gordinho europeu.",
    "• Tóquio — parques arborizados de Shinjuku.",
    "• Nova York — Central Park tem a colônia mais famosa dos EUA.",
    "• Brasil — lagos de parques municipais e quintais de fazenda.",
])

# ============ SLIDE 7: CURIOSIDADES ============
s = new_slide()
add_title_box(s, "Fatos Que Você Precisa Saber")
add_body_text(s, [
    "• O pato gordinho mais famoso da história foi o Patinho Feio (que depois cresceu).",
    "• Patos gordinhos conseguem nadar 30% mais devagar, mas 100% mais dignamente.",
    "• A média de peso de um gordinho é 4 kg — 50% acima do peso ideal.",
    "• Eles nunca nadam em círculos. Sempre em linha reta (para fora).",
    "• O 'quá-quá' de um gordinho ecoa 3 segundos a mais.",
])

# ============ SLIDE 8: CONCLUSÃO ============
s = new_slide()
add_title_box(s, "Conclusão", x=Inches(0.7), y=Inches(0.5), size=44)
add_body_text(s, [
    "Patos gordinhos são a prova de que",
    "viver bem é mais importante do que",
    "viver magro.",
    "",
    "Respeite o gordinho. Ele se esforça. 💛",
], y=Inches(1.8))
add_duck(s, Inches(9.5), Inches(3.8), size=Inches(3.0))

# ============ SLIDE 9: OBRIGADO ============
s = new_slide()
add_title_box(s, "Obrigado!", x=Inches(0.7), y=Inches(2.2), size=72, color=AZUL_TEXTO)
tb = s.shapes.add_textbox(Inches(0.7), Inches(3.8), Inches(9), Inches(0.8))
p = tb.text_frame.paragraphs[0]
p.text = "Feito com amor e pão para os gordinhos 🦆"
p.font.size = Pt(22)
p.font.color.rgb = CINZA
add_duck(s, Inches(8.5), Inches(3.2), size=Inches(3.4))

output = r"c:\Users\PERRY COMPUTER\Desktop\LANDING PAGE - REGIS\patos-gordinhos.pptx"
prs.save(output)
print("Apresentação salva em:", output)
