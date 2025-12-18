# Modular Pipeline Architecture

## Vision

Transform the AI Card Composer into a **universal widget factory** that can generate any type of visual content (business cards, tarot cards, birthday cards, flyers, social media posts, etc.) using a configurable pipeline system.

---

## Core Concepts

### 1. Widget = Reusable Template Pipeline

A **Widget** is a complete, self-contained configuration for generating a specific type of content:

```
Widget = {
  metadata      → name, description, category, tags
  canvas        → dimensions, aspect ratio, bleed zones
  fields        → what data the user inputs
  templates     → layout presets with field positions
  prompts       → AI generation instructions
  assets        → reference images, fonts, icons
  export        → output formats, resolutions
}
```

### 2. Pipeline Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                        WIDGET PIPELINE                                │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   CONFIG    │───▶│   INPUT     │───▶│     AI      │───▶│   RENDER    │
│   (JSON)    │    │   (User)    │    │  (Backend)  │    │  (Canvas)   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │                  │
      ▼                  ▼                  ▼                  ▼
  Widget Def         Form Data          Generated           Final
  Templates          Field Values        Assets             Export
  Prompts            Images             Composed Image       PNG/PDF
```

---

## Architecture Overview

```
src/
├── core/                           # Core pipeline engine
│   ├── engine/
│   │   ├── PipelineEngine.ts       # Orchestrates the entire pipeline
│   │   ├── RenderEngine.ts         # Canvas rendering & composition
│   │   └── ExportEngine.ts         # Multi-format export handler
│   ├── registry/
│   │   ├── WidgetRegistry.ts       # Widget discovery & loading
│   │   └── PresetRegistry.ts       # User-saved presets
│   └── types/
│       ├── widget.types.ts         # Widget configuration types
│       ├── template.types.ts       # Template & layout types
│       ├── prompt.types.ts         # AI prompt types
│       └── field.types.ts          # Dynamic form field types
│
├── widgets/                        # Widget definitions (JSON + assets)
│   ├── business-card/
│   │   ├── widget.json             # Widget configuration
│   │   ├── templates/
│   │   │   ├── modern.json
│   │   │   ├── classic.json
│   │   │   └── minimal.json
│   │   ├── prompts/
│   │   │   ├── backend.json        # AI generation prompts
│   │   │   └── frontend.json       # UI guidance prompts
│   │   └── assets/
│   │       └── reference/          # Reference images for AI
│   │
│   ├── tarot-card/
│   │   ├── widget.json
│   │   ├── templates/
│   │   ├── prompts/
│   │   └── assets/
│   │
│   ├── birthday-card/
│   ├── flyer/
│   ├── social-media/
│   └── ...
│
├── services/                       # External integrations
│   ├── ai/
│   │   ├── AIServiceAdapter.ts     # Abstract AI interface
│   │   ├── providers/
│   │   │   ├── NanaBananaProvider.ts
│   │   │   ├── MidjourneyProvider.ts
│   │   │   ├── DallEProvider.ts
│   │   │   ├── StableDiffusionProvider.ts
│   │   │   └── ReplicateProvider.ts
│   │   └── PromptBuilder.ts        # Dynamic prompt construction
│   └── storage/
│       ├── PresetStorage.ts        # Local/cloud preset storage
│       └── AssetStorage.ts         # Image asset management
│
├── components/                     # React UI components
│   ├── composer/
│   │   ├── WidgetComposer.tsx      # Main composer (universal)
│   │   ├── CanvasPreview.tsx       # Live preview component
│   │   ├── DynamicForm.tsx         # Auto-generated forms
│   │   └── TemplateSelector.tsx    # Template picker
│   ├── widgets/
│   │   ├── WidgetGallery.tsx       # Browse all widgets
│   │   ├── WidgetCard.tsx          # Widget preview card
│   │   └── WidgetLoader.tsx        # Lazy widget loading
│   └── presets/
│       ├── PresetManager.tsx       # Save/load presets
│       └── PresetPicker.tsx        # Quick preset selection
│
├── hooks/
│   ├── useWidget.ts                # Widget loading & state
│   ├── usePipeline.ts              # Pipeline execution
│   ├── useAIGeneration.ts          # AI service integration
│   └── usePresets.ts               # Preset management
│
└── store/                          # Global state (Zustand/Redux)
    ├── widgetStore.ts              # Active widget state
    ├── pipelineStore.ts            # Pipeline execution state
    └── presetStore.ts              # User presets
```

---

## JSON Configuration Schema

### Widget Definition (`widget.json`)

```json
{
  "$schema": "https://ai-card-composer.dev/schemas/widget.schema.json",
  "version": "1.0.0",
  "metadata": {
    "id": "business-card",
    "name": "Business Card",
    "description": "Professional business cards with AI-enhanced backgrounds",
    "category": "professional",
    "tags": ["business", "corporate", "networking"],
    "icon": "briefcase",
    "thumbnail": "./assets/thumbnail.png"
  },

  "canvas": {
    "width": 1050,
    "height": 600,
    "unit": "px",
    "aspectRatio": "1.75:1",
    "previewScale": 0.38,
    "bleed": {
      "enabled": true,
      "size": 9
    },
    "safeZone": {
      "enabled": true,
      "margin": 36
    }
  },

  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "placeholder": "John Doe",
      "required": true,
      "maxLength": 50,
      "style": {
        "fontFamily": "Inter",
        "fontSize": { "min": 18, "max": 36, "default": 24 },
        "fontWeight": ["normal", "bold"],
        "defaultWeight": "bold"
      }
    },
    {
      "id": "title",
      "type": "text",
      "label": "Job Title",
      "placeholder": "Creative Director",
      "required": false,
      "maxLength": 60
    },
    {
      "id": "logo",
      "type": "image",
      "label": "Company Logo",
      "required": false,
      "maxSize": "2MB",
      "acceptedFormats": ["png", "svg", "jpg"],
      "dimensions": { "maxWidth": 200, "maxHeight": 100 }
    },
    {
      "id": "qrCode",
      "type": "generated",
      "generator": "qrcode",
      "source": "website",
      "label": "QR Code",
      "size": 80
    }
  ],

  "templates": {
    "default": "modern",
    "available": ["modern", "classic", "minimal", "executive", "creative"]
  },

  "prompts": {
    "backend": "./prompts/backend.json",
    "frontend": "./prompts/frontend.json"
  },

  "assets": {
    "fonts": ["Inter", "Playfair Display", "Roboto Mono"],
    "icons": "./assets/icons/",
    "reference": "./assets/reference/"
  },

  "export": {
    "formats": ["png", "pdf", "svg"],
    "defaultFormat": "png",
    "resolutions": {
      "web": { "dpi": 72, "scale": 1 },
      "print": { "dpi": 300, "scale": 4.17 },
      "retina": { "dpi": 144, "scale": 2 }
    }
  },

  "aiWorkflow": {
    "enabled": true,
    "provider": "auto",
    "features": {
      "backgroundGeneration": true,
      "styleTransfer": true,
      "colorHarmonization": true,
      "textEnhancement": false
    }
  }
}
```

### Template Definition (`templates/modern.json`)

```json
{
  "id": "modern",
  "name": "Modern",
  "description": "Clean, professional layout with left-aligned hierarchy",
  "thumbnail": "./modern-thumb.png",

  "layout": {
    "type": "absolute",
    "grid": {
      "columns": 12,
      "rows": 8,
      "gap": 8
    }
  },

  "fields": {
    "name": {
      "position": { "x": 40, "y": 60 },
      "size": { "width": 280, "height": 36 },
      "style": {
        "fontSize": 28,
        "fontWeight": "bold",
        "textAlign": "left",
        "color": "inherit"
      },
      "animation": "fade-in-left"
    },
    "title": {
      "position": { "x": 40, "y": 100 },
      "size": { "width": 260, "height": 24 },
      "style": {
        "fontSize": 18,
        "fontWeight": "normal",
        "textAlign": "left",
        "color": "inherit",
        "opacity": 0.9
      }
    },
    "company": {
      "position": { "x": 40, "y": 130 },
      "size": { "width": 240, "height": 20 },
      "style": {
        "fontSize": 14,
        "fontWeight": "500",
        "textTransform": "uppercase",
        "letterSpacing": "0.05em"
      }
    },
    "phone": {
      "position": { "x": 40, "y": 180 },
      "size": { "width": 160, "height": 18 },
      "style": { "fontSize": 12 },
      "icon": "phone"
    },
    "email": {
      "position": { "x": 40, "y": 200 },
      "size": { "width": 200, "height": 18 },
      "style": { "fontSize": 12 },
      "icon": "mail"
    },
    "website": {
      "position": { "x": 40, "y": 220 },
      "size": { "width": 180, "height": 18 },
      "style": { "fontSize": 12 },
      "icon": "globe"
    },
    "logo": {
      "position": { "x": 320, "y": 40 },
      "size": { "width": 60, "height": 60 },
      "type": "image",
      "objectFit": "contain"
    },
    "qrCode": {
      "position": { "x": 310, "y": 160 },
      "size": { "width": 80, "height": 80 },
      "type": "generated"
    }
  },

  "background": {
    "default": {
      "type": "solid",
      "color": "#1a2744"
    },
    "aiSuggestions": [
      "elegant dark gradient",
      "subtle geometric pattern",
      "professional abstract"
    ]
  },

  "colorSchemes": [
    {
      "name": "Corporate Blue",
      "background": "#1a2744",
      "text": "#f8fafc",
      "accent": "#3b82f6"
    },
    {
      "name": "Elegant Dark",
      "background": "#18181b",
      "text": "#fafafa",
      "accent": "#a855f7"
    }
  ]
}
```

### Prompt Definition (`prompts/backend.json`)

```json
{
  "version": "1.0.0",
  "provider": "universal",

  "systemPrompt": {
    "role": "You are an expert graphic designer specializing in {widgetType} design.",
    "context": "Generate professional background images that complement text overlay.",
    "constraints": [
      "Maintain clear zones for text placement",
      "Use subtle, non-distracting patterns",
      "Ensure high contrast areas for readability"
    ]
  },

  "templates": {
    "backgroundGeneration": {
      "base": "Create a {style} background for a {widgetType}. Dimensions: {width}x{height}px.",
      "variables": {
        "style": ["elegant", "modern", "minimalist", "bold", "artistic"],
        "mood": ["professional", "creative", "luxurious", "friendly", "sophisticated"]
      },
      "modifiers": {
        "textSafeZones": "Leave clear space in the following areas: {zones}",
        "colorHarmony": "Use colors that complement {primaryColor}",
        "brandAlignment": "Match the aesthetic of {brandDescription}"
      }
    },

    "styleTransfer": {
      "base": "Apply the visual style of the reference image to generate a new {widgetType} background.",
      "referenceHandling": "Preserve composition and color palette while creating unique artwork."
    },

    "compositing": {
      "nanaBanana": {
        "prompt": "Composite the following elements into a cohesive {widgetType} design:",
        "layers": [
          { "type": "background", "source": "{backgroundImage}" },
          { "type": "overlay", "source": "{textOverlay}", "blendMode": "normal" },
          { "type": "accent", "source": "{decorativeElements}", "opacity": 0.8 }
        ]
      }
    }
  },

  "qualityEnhancers": [
    "high resolution",
    "professional quality",
    "print-ready",
    "sharp details",
    "balanced composition"
  ],

  "negativePrompts": [
    "text",
    "letters",
    "words",
    "watermark",
    "signature",
    "blurry",
    "low quality",
    "distorted"
  ]
}
```

### Frontend Prompts (`prompts/frontend.json`)

```json
{
  "version": "1.0.0",

  "ui": {
    "workflow": {
      "title": "AI-Enhanced {widgetName} Creator",
      "description": "Create stunning {widgetType}s with AI-powered design assistance",
      "steps": [
        {
          "id": 1,
          "title": "Choose Template",
          "description": "Select a layout that matches your style"
        },
        {
          "id": 2,
          "title": "Enter Information",
          "description": "Fill in your {fieldSummary}"
        },
        {
          "id": 3,
          "title": "Generate Background",
          "description": "Use AI to create a unique background design"
        },
        {
          "id": 4,
          "title": "Export",
          "description": "Download your finished {widgetType}"
        }
      ]
    },

    "tooltips": {
      "aiGenerate": "Click to generate an AI background based on your template and color choices",
      "templateGuides": "Toggle field guides to see where text will be placed",
      "safeZone": "Keep important content within this area for print safety"
    },

    "suggestions": {
      "styles": [
        { "label": "Professional", "prompt": "clean corporate gradient with subtle patterns" },
        { "label": "Creative", "prompt": "bold artistic background with vibrant colors" },
        { "label": "Minimalist", "prompt": "simple solid background with elegant accents" },
        { "label": "Luxurious", "prompt": "rich textures with gold or metallic accents" }
      ]
    }
  },

  "validation": {
    "messages": {
      "required": "{fieldLabel} is required",
      "maxLength": "{fieldLabel} must be under {max} characters",
      "imageSize": "Image must be under {maxSize}",
      "imageFormat": "Supported formats: {formats}"
    }
  },

  "help": {
    "aiWorkflow": {
      "title": "How AI Generation Works",
      "content": "Our AI creates unique backgrounds tailored to your {widgetType}. The system preserves text areas and maintains brand consistency."
    }
  }
}
```

---

## Widget Examples

### Tarot Card Widget (`widgets/tarot-card/widget.json`)

```json
{
  "metadata": {
    "id": "tarot-card",
    "name": "Tarot Card",
    "description": "Mystical tarot cards with AI-generated artwork",
    "category": "creative",
    "tags": ["mystical", "spiritual", "oracle", "divination"]
  },

  "canvas": {
    "width": 750,
    "height": 1275,
    "aspectRatio": "1:1.7",
    "previewScale": 0.3
  },

  "fields": [
    {
      "id": "cardName",
      "type": "text",
      "label": "Card Name",
      "placeholder": "The Fool",
      "required": true
    },
    {
      "id": "cardNumber",
      "type": "select",
      "label": "Card Number",
      "options": ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
                  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"]
    },
    {
      "id": "meaning",
      "type": "textarea",
      "label": "Card Meaning",
      "placeholder": "New beginnings, innocence, spontaneity...",
      "maxLength": 200
    },
    {
      "id": "reversed",
      "type": "textarea",
      "label": "Reversed Meaning",
      "placeholder": "Recklessness, risk-taking, foolishness...",
      "maxLength": 200
    }
  ],

  "templates": {
    "default": "rider-waite",
    "available": ["rider-waite", "minimalist", "art-nouveau", "dark-gothic", "cosmic"]
  }
}
```

### Birthday Card Widget (`widgets/birthday-card/widget.json`)

```json
{
  "metadata": {
    "id": "birthday-card",
    "name": "Birthday Card",
    "description": "Personalized birthday cards with custom messages",
    "category": "celebration",
    "tags": ["birthday", "celebration", "greeting", "party"]
  },

  "canvas": {
    "width": 1400,
    "height": 1000,
    "aspectRatio": "1.4:1",
    "foldable": true,
    "foldType": "half-horizontal"
  },

  "fields": [
    {
      "id": "recipientName",
      "type": "text",
      "label": "Recipient Name",
      "placeholder": "Sarah",
      "required": true
    },
    {
      "id": "age",
      "type": "number",
      "label": "Age (optional)",
      "placeholder": "30",
      "required": false
    },
    {
      "id": "greeting",
      "type": "select",
      "label": "Greeting Style",
      "options": ["Happy Birthday", "Feliz Cumpleaños", "Joyeux Anniversaire", "Custom"],
      "default": "Happy Birthday"
    },
    {
      "id": "message",
      "type": "textarea",
      "label": "Personal Message",
      "placeholder": "Wishing you all the best on your special day!",
      "maxLength": 300
    },
    {
      "id": "senderName",
      "type": "text",
      "label": "From",
      "placeholder": "Your Name"
    }
  ],

  "templates": {
    "default": "festive",
    "available": ["festive", "elegant", "kids", "milestone", "photo-frame"]
  }
}
```

### Flyer Widget (`widgets/flyer/widget.json`)

```json
{
  "metadata": {
    "id": "flyer",
    "name": "Event Flyer",
    "description": "Eye-catching flyers for events and promotions",
    "category": "marketing",
    "tags": ["event", "promotion", "poster", "advertisement"]
  },

  "canvas": {
    "width": 2550,
    "height": 3300,
    "aspectRatio": "8.5:11",
    "unit": "px",
    "printSize": { "width": 8.5, "height": 11, "unit": "in" }
  },

  "fields": [
    {
      "id": "headline",
      "type": "text",
      "label": "Headline",
      "placeholder": "SUMMER MUSIC FESTIVAL",
      "required": true,
      "style": { "fontSize": { "min": 48, "max": 120 } }
    },
    {
      "id": "subheadline",
      "type": "text",
      "label": "Subheadline",
      "placeholder": "The biggest event of the year!"
    },
    {
      "id": "date",
      "type": "date",
      "label": "Event Date",
      "required": true
    },
    {
      "id": "time",
      "type": "time",
      "label": "Event Time"
    },
    {
      "id": "location",
      "type": "text",
      "label": "Venue/Location",
      "placeholder": "Central Park Amphitheater"
    },
    {
      "id": "description",
      "type": "textarea",
      "label": "Event Description",
      "maxLength": 500
    },
    {
      "id": "ticketInfo",
      "type": "text",
      "label": "Ticket Info",
      "placeholder": "$25 Early Bird | $35 at Door"
    },
    {
      "id": "contactInfo",
      "type": "text",
      "label": "Contact/Website",
      "placeholder": "www.summerfest.com"
    },
    {
      "id": "featuredImage",
      "type": "image",
      "label": "Featured Image",
      "required": false
    }
  ],

  "templates": {
    "default": "bold-modern",
    "available": ["bold-modern", "concert", "corporate", "community", "sale"]
  }
}
```

---

## AI Service Integration

### Provider Interface

```typescript
// services/ai/AIServiceAdapter.ts

interface AIGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  referenceImages?: string[];
  style?: string;
  seed?: number;
}

interface AIGenerationResponse {
  imageUrl: string;
  imageBase64?: string;
  metadata: {
    provider: string;
    model: string;
    generationTime: number;
    seed: number;
  };
}

interface AIServiceProvider {
  name: string;
  generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse>;
  composeImage?(layers: ImageLayer[]): Promise<AIGenerationResponse>;
  estimateCost?(request: AIGenerationRequest): number;
  isAvailable(): Promise<boolean>;
}
```

### Nana Banana Integration Example

```typescript
// services/ai/providers/NanaBananaProvider.ts

export class NanaBananaProvider implements AIServiceProvider {
  name = 'NanaBanana';

  async generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    // API integration with Nana Banana
    const response = await fetch('https://api.nanabanana.ai/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: request.prompt,
        negative_prompt: request.negativePrompt,
        width: request.width,
        height: request.height,
        reference_images: request.referenceImages,
        style_preset: request.style
      })
    });

    return response.json();
  }

  async composeImage(layers: ImageLayer[]): Promise<AIGenerationResponse> {
    // Multi-layer composition
    return await fetch('https://api.nanabanana.ai/compose', {
      method: 'POST',
      body: JSON.stringify({ layers })
    }).then(r => r.json());
  }
}
```

---

## Preset System

### Preset Schema

```json
{
  "preset": {
    "id": "my-company-card",
    "name": "My Company Business Card",
    "widgetId": "business-card",
    "templateId": "modern",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:22:00Z",

    "fieldDefaults": {
      "company": "Acme Corporation",
      "website": "www.acme.com"
    },

    "design": {
      "backgroundColor": "#1e3a5f",
      "textColor": "#ffffff",
      "accentColor": "#00b4d8",
      "backgroundImage": "preset://my-company-card/background.png"
    },

    "aiSettings": {
      "preferredProvider": "nanabanana",
      "stylePreset": "corporate-modern",
      "referenceImages": [
        "preset://my-company-card/ref-1.png",
        "preset://my-company-card/ref-2.png"
      ]
    },

    "exportDefaults": {
      "format": "png",
      "resolution": "print"
    }
  }
}
```

### Preset Manager

```typescript
// hooks/usePresets.ts

interface Preset {
  id: string;
  name: string;
  widgetId: string;
  templateId: string;
  fieldDefaults: Record<string, any>;
  design: DesignSettings;
  aiSettings: AISettings;
}

export function usePresets(widgetId: string) {
  const [presets, setPresets] = useState<Preset[]>([]);

  const savePreset = async (preset: Omit<Preset, 'id'>) => {
    const id = generateId();
    const newPreset = { ...preset, id, createdAt: new Date() };
    await storage.savePreset(newPreset);
    setPresets(prev => [...prev, newPreset]);
    return newPreset;
  };

  const loadPreset = async (presetId: string) => {
    return await storage.getPreset(presetId);
  };

  const applyPreset = (preset: Preset) => {
    // Apply to current widget state
    setFieldValues(preset.fieldDefaults);
    setDesign(preset.design);
    setAISettings(preset.aiSettings);
  };

  return { presets, savePreset, loadPreset, applyPreset };
}
```

---

## Migration Path

### Phase 1: Extract Core Types & Interfaces
- Create type definitions for widgets, templates, fields
- Define AI service interfaces
- Extract current templates to JSON format

### Phase 2: Build Core Engine
- Implement PipelineEngine
- Create RenderEngine with canvas composition
- Build dynamic form generator

### Phase 3: Widget Registry
- Create widget loading system
- Implement first widget (business card) in new format
- Add template discovery

### Phase 4: AI Integration
- Implement AI service adapter pattern
- Add Nana Banana provider
- Build prompt construction system

### Phase 5: Preset System
- Local storage for presets
- Preset CRUD operations
- Quick-apply functionality

### Phase 6: Additional Widgets
- Tarot cards
- Birthday cards
- Flyers
- Social media posts

---

## Benefits of This Architecture

1. **Reusability**: One codebase, infinite widget types
2. **Configurability**: JSON-driven, no code changes needed for new widgets
3. **Extensibility**: Easy to add new AI providers, export formats, field types
4. **Maintainability**: Clear separation of concerns
5. **Scalability**: Widget files can be lazy-loaded
6. **Community**: Users can create and share widget definitions
7. **Testability**: Each component is independently testable
