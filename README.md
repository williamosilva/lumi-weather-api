# Weather API para Chatbot

API simples que retorna dados meteorológicos para ser usada como base de um chatbot.

## Como usar

```
GET /weather
```

### Parâmetros opcionais:

- `lat` - latitude
- `lon` - longitude
- `units` - metric, imperial ou standard
- `lang` - idioma (pt, en, etc)

### Exemplos:

```
# Clima padrão (Londrina)
GET /weather

# Clima para coordenadas específicas
GET /weather?lat=-22.9068&lon=-43.1729
```

## Configuração

Criar arquivo `.env`:

```env
# OpenWeather API Configuration
OPENWEATHER_API_KEY=

# Coordinates (Londrina, Brazil)
DEFAULT_LAT=-23.2927
DEFAULT_LON=-51.1732

# Default settings
DEFAULT_UNITS=metric
DEFAULT_LANG=pt

# Application
PORT=3000
```

## Rodar o projeto

```bash
npm install
npm run start:dev
```

A API estará disponível em `http://localhost:3000/weather`

---

**Feito para ser consumido por um chatbot chamado LUMI :)**
