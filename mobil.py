import pygame
import random

pygame.init()
pygame.mixer.init()

WIDTH = 500
HEIGHT = 700

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Traffic Dodger")

clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 40)

# Player
player_x = 220
player_y = 580
player_speed = 8

# Musuh
enemy_speed = 6

enemy_x = random.randint(50, 400)
enemy_y = -100

enemy2_x = random.randint(50, 400)
enemy2_y = -300

enemy3_x = random.randint(50, 400)
enemy3_y = -600

# Koin
coin_x = random.randint(50, 400)
coin_y = -200
coin_speed = 5

# Data game
score = 0
level = 1
lives = 3

line_y = 0

# Load gambar
player_img = pygame.image.load("mobil.png.jpeg")
enemy_img = pygame.image.load("musuh.png.jpeg")
coin_img = pygame.image.load("coin.png")
heart = pygame.image.load("nyawa.png")
coin_sound = pygame.mixer.Sound("coin.wav")
crash_sound = pygame.mixer.Sound("crash.wav")
engine_sound = pygame.mixer.Sound("engine.mp3")

player_img.set_colorkey((0,0,0))
enemy_img.set_colorkey((0,0,0))

player_img = pygame.transform.smoothscale(player_img,(60,100))
enemy_img = pygame.transform.smoothscale(enemy_img,(60,100))
coin_img = pygame.transform.smoothscale(coin_img,(40,40))
heart = pygame.transform.smoothscale(heart,(35,35))

running = True
engine_sound.play(-1)

while running:

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Gerak player
    keys = pygame.key.get_pressed()

    if keys[pygame.K_LEFT]:
        player_x -= player_speed

    if keys[pygame.K_RIGHT]:
        player_x += player_speed

    if player_x < 50:
        player_x = 50

    if player_x > 390:
        player_x = 390

    # Musuh turun
    enemy_y += enemy_speed
    enemy2_y += enemy_speed
    enemy3_y += enemy_speed

    # Koin turun
    coin_y += coin_speed

    # Jika musuh keluar layar
    if enemy_y > HEIGHT:
        enemy_y = -100
        enemy_x = random.randint(50,400)
        score += 1

    if enemy2_y > HEIGHT:
        enemy2_y = -300
        enemy2_x = random.randint(50,400)
        score += 1

    if enemy3_y > HEIGHT:
        enemy3_y = -600
        enemy3_x = random.randint(50,400)
        score += 1

    # Jika koin keluar
    if coin_y > HEIGHT:
        coin_y = -200
        coin_x = random.randint(50,400)

    # Level
    level = score // 10 + 1
    enemy_speed = 6 + level

    # Collision
    player_rect = pygame.Rect(player_x, player_y, 60,100)

    enemy_rect = pygame.Rect(enemy_x, enemy_y, 60,100)
    enemy2_rect = pygame.Rect(enemy2_x, enemy2_y, 60,100)
    enemy3_rect = pygame.Rect(enemy3_x, enemy3_y, 60,100)

    coin_rect = pygame.Rect(coin_x, coin_y, 40,40)

    if player_rect.colliderect(enemy_rect):
        lives -= 1
        enemy_y = -100
        crash_sound.play()

    if player_rect.colliderect(enemy2_rect):
        lives -= 1
        enemy2_y = -300
        crash_sound.play()

    if player_rect.colliderect(enemy3_rect):
        lives -= 1
        enemy3_y = -600
        crash_sound.play()

    # Ambil koin
    if player_rect.colliderect(coin_rect):
        score += 1
        coin_sound.play()

        coin_y = -100
        coin_x = random.randint(50,400)

    # Background
    screen.fill((80,80,80))

    # Garis jalan
    for i in range(8):
        pygame.draw.rect(
            screen,
            (255,255,255),
            (240, line_y + i*120, 20,70)
        )

    line_y += 10

    if line_y > 120:
        line_y = 0

    # Gambar
    screen.blit(player_img,(player_x,player_y))

    screen.blit(enemy_img,(enemy_x,enemy_y))
    screen.blit(enemy_img,(enemy2_x,enemy2_y))
    screen.blit(enemy_img,(enemy3_x,enemy3_y))

    screen.blit(coin_img,(coin_x,coin_y))

    # Score
    score_text = font.render(
        f"Score : {score}",
        True,
        (255,255,255)
    )

    level_text = font.render(
        f"Level : {level}",
        True,
        (255,255,0)
    )

    screen.blit(score_text,(10,10))
    screen.blit(level_text,(10,50))

    # Nyawa
    for i in range(lives):
        screen.blit(heart,(10 + i*40,90))

    # Game over
    if lives <= 0:
        crash_sound.play()
        engine_sound.stop()

        game_font = pygame.font.SysFont(None,80)

        text = game_font.render(
            "GAME OVER",
            True,
            (255,0,0)
        )

        screen.blit(text,(60,300))

        pygame.display.update()

        pygame.time.delay(3000)

        running = False

    pygame.display.update()
    clock.tick(60)

pygame.quit()