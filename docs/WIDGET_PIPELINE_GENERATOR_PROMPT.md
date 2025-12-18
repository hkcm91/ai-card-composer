# Widget Pipeline Generator Prompt

Use this prompt with an AI code generator (Claude, GPT-4, etc.) to implement the modular pipeline system.

---

## PROMPT START

You are an expert TypeScript/React developer. I need you to implement a modular pipeline system for a card/content generation app. The architecture has been designed and type definitions already exist. Your job is to implement the actual engines, registries, hooks, and components.

### Project Context

**Tech Stack:**
- React 18 + TypeScript 5
- Vite build system
- Tailwind CSS + shadcn/ui components
- TanStack React Query
- Zustand (add for state management)

**Existing Structure:**
```
src/
├── core/types/           # ✅ ALREADY EXISTS - Type definitions
│   ├── widget.types.ts   # Widget, Template, Field types
│   ├── ai.types.ts       # AI provider interfaces
│   ├── preset.types.ts   # Preset system types
│   ├── pipeline.types.ts # Pipeline engine types
│   └── index.ts          # Type exports
├── widgets/              # ✅ ALREADY EXISTS - JSON configurations
│   ├── business-card/
│   ├── tarot-card/
│   └── birthday-card/
├── pages/
│   └── Index.tsx         # Current monolithic component (will be replaced)
└── components/ui/        # shadcn/ui components
```

### Your Task

Implement the following modules in order:

---

## 1. CORE ENGINE IMPLEMENTATIONS

### 1.1 Widget Registry (`src/core/engine/WidgetRegistry.ts`)

```typescript
/**
 * Implement a WidgetRegistry that:
 * - Loads widget.json files from src/widgets/*/
 * - Caches loaded widgets
 * - Provides lookup by ID
 * - Supports dynamic widget discovery
 * - Validates widget configurations against types
 */

import type { Widget, WidgetRegistry as IWidgetRegistry } from '../types';

export class WidgetRegistry implements IWidgetRegistry {
  private widgets: Map<string, Widget> = new Map();
  private loading: Map<string, Promise<Widget>> = new Map();

  // Implement these methods:
  async register(widget: Widget): Promise<void>;
  async load(widgetId: string): Promise<Widget>;
  get(widgetId: string): Widget | null;
  getAll(): Widget[];
  getByCategory(category: string): Widget[];
  search(query: string): Widget[];
  has(widgetId: string): boolean;
  unregister(widgetId: string): void;

  // Helper to load all widgets from the widgets directory
  async discoverWidgets(): Promise<void>;
}

export const widgetRegistry = new WidgetRegistry();
```

### 1.2 Template Registry (`src/core/engine/TemplateRegistry.ts`)

```typescript
/**
 * Implement a TemplateRegistry that:
 * - Loads template JSON files for each widget
 * - Associates templates with their parent widgets
 * - Provides template lookup
 */

import type { Template, TemplateRegistry as ITemplateRegistry } from '../types';

export class TemplateRegistryImpl implements ITemplateRegistry {
  private templates: Map<string, Map<string, Template>> = new Map();

  async register(widgetId: string, template: Template): Promise<void>;
  async load(widgetId: string, templateId: string): Promise<Template>;
  get(widgetId: string, templateId: string): Template | null;
  getForWidget(widgetId: string): Template[];
  unregister(widgetId: string, templateId: string): void;
}

export const templateRegistry = new TemplateRegistryImpl();
```

### 1.3 Render Engine (`src/core/engine/RenderEngine.ts`)

```typescript
/**
 * Implement a RenderEngine that:
 * - Renders widgets to HTML5 Canvas
 * - Supports background images (solid, gradient, uploaded, AI-generated)
 * - Renders text fields at template-defined positions
 * - Renders images (logos, photos) with proper scaling
 * - Renders generated elements (QR codes)
 * - Supports preview mode (fast, lower quality) and export mode (high quality)
 * - Renders template guides/safe zones when enabled
 */

import type {
  RenderEngine as IRenderEngine,
  RenderInput,
  RenderedOutput,
  ExportRenderOptions,
  GuideOptions,
  Template
} from '../types';

export class RenderEngine implements IRenderEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  setCanvas(canvas: HTMLCanvasElement): void;
  async render(state: RenderInput): Promise<RenderedOutput>;
  async renderPreview(state: RenderInput): Promise<RenderedOutput>;
  async renderExport(state: RenderInput, options: ExportRenderOptions): Promise<RenderedOutput>;
  renderGuides(template: Template, options: GuideOptions): void;
  clear(): void;
  getContext(): CanvasRenderingContext2D | null;

  // Private helpers
  private drawBackground(design: DesignState, width: number, height: number): Promise<void>;
  private drawTextField(field: TemplateFieldConfig, value: string, design: DesignState): void;
  private drawImage(field: TemplateFieldConfig, imageData: string): Promise<void>;
  private drawGenerated(field: TemplateFieldConfig, type: string, data: any): Promise<void>;
  private loadImage(src: string): Promise<HTMLImageElement>;
}

export const renderEngine = new RenderEngine();
```

### 1.4 Export Engine (`src/core/engine/ExportEngine.ts`)

```typescript
/**
 * Implement an ExportEngine that:
 * - Exports canvas to PNG, JPG, PDF formats
 * - Supports multiple resolutions (web 72dpi, print 300dpi, retina 144dpi)
 * - Handles proper scaling for print output
 * - Generates appropriate filenames
 * - Adds metadata to exports
 */

import type {
  ExportEngine as IExportEngine,
  ExportInput,
  ExportResult,
  ExportFormat
} from '../types';

export class ExportEngine implements IExportEngine {
  async export(input: ExportInput): Promise<ExportResult>;
  async exportMultiple(input: ExportInput, formats: ExportFormat[]): Promise<ExportResult[]>;
  getSupportedFormats(): ExportFormat[];
  estimateSize(input: ExportInput): number;

  // Private helpers
  private scaleCanvas(canvas: HTMLCanvasElement, scale: number): HTMLCanvasElement;
  private canvasToBlob(canvas: HTMLCanvasElement, format: ExportFormat, quality: number): Promise<Blob>;
  private generateFilename(widget: Widget, fields: Record<string, any>, format: ExportFormat): string;
  private triggerDownload(blob: Blob, filename: string): void;
}

export const exportEngine = new ExportEngine();
```

### 1.5 Pipeline Engine (`src/core/engine/PipelineEngine.ts`)

```typescript
/**
 * Implement the main PipelineEngine that:
 * - Orchestrates the entire widget creation flow
 * - Manages pipeline state
 * - Coordinates between registries, render engine, and export engine
 * - Handles AI generation workflow
 * - Supports undo/redo history
 * - Emits events for UI updates
 */

import type {
  PipelineEngine as IPipelineEngine,
  PipelineState,
  PipelineStateCallback,
  AIGenerationOptions,
  RenderedOutput,
  ExportOptions,
  ExportResult
} from '../types';

export class PipelineEngine implements IPipelineEngine {
  private state: PipelineState;
  private listeners: Set<PipelineStateCallback> = new Set();
  private renderDebounceTimer: number | null = null;

  constructor(config?: Partial<PipelineConfig>);

  async loadWidget(widgetId: string): Promise<Widget>;
  async loadTemplate(templateId: string): Promise<Template>;
  async initialize(widgetId: string, presetId?: string): Promise<PipelineState>;

  updateFields(fields: Record<string, any>): void;
  updateDesign(design: Partial<DesignState>): void;

  async generateWithAI(options?: AIGenerationOptions): Promise<AIGenerationResponse>;
  async render(): Promise<RenderedOutput>;
  async export(options: ExportOptions): Promise<ExportResult>;

  getState(): PipelineState;
  subscribe(callback: PipelineStateCallback): () => void;

  undo(): void;
  redo(): void;
  reset(): void;
  dispose(): void;

  // Private helpers
  private setState(updates: Partial<PipelineState>): void;
  private pushHistory(): void;
  private validateFields(): ValidationError[];
  private scheduleRender(): void;
}

export const createPipeline = (config?: Partial<PipelineConfig>) => new PipelineEngine(config);
```

---

## 2. AI SERVICE IMPLEMENTATIONS

### 2.1 AI Service Adapter (`src/services/ai/AIServiceAdapter.ts`)

```typescript
/**
 * Implement an abstract adapter that:
 * - Defines the common interface for all AI providers
 * - Handles common preprocessing (prompt building, image preparation)
 * - Provides error handling and retry logic
 */

import type {
  AIServiceProvider,
  AIGenerationRequest,
  AIGenerationResponse,
  AICapabilities
} from '../../core/types';

export abstract class AIServiceAdapter implements AIServiceProvider {
  abstract name: string;
  abstract displayName: string;
  abstract capabilities: AICapabilities;

  abstract generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse>;

  async composeImage?(request: AICompositionRequest): Promise<AIGenerationResponse>;
  async styleTransfer?(request: AIStyleTransferRequest): Promise<AIGenerationResponse>;

  estimateCost?(request: AIGenerationRequest): CostEstimate;
  abstract isAvailable(): Promise<boolean>;
  abstract validateCredentials(): Promise<boolean>;

  // Shared utilities
  protected buildPrompt(template: string, variables: Record<string, any>): string;
  protected addQualityEnhancers(prompt: string, enhancers: string[]): string;
  protected buildNegativePrompt(baseNegatives: string[], additions?: string[]): string;
  protected prepareImage(imageData: string): Promise<string>;
  protected handleError(error: any): AIError;
  protected async retry<T>(fn: () => Promise<T>, maxRetries: number): Promise<T>;
}
```

### 2.2 Manual Provider (`src/services/ai/providers/ManualProvider.ts`)

```typescript
/**
 * Implement a "manual" provider for the current workflow where users:
 * - Download template with guides
 * - Use external AI services
 * - Upload the result back
 *
 * This provider just returns instructions rather than generating images.
 */

export class ManualProvider extends AIServiceAdapter {
  name = 'manual';
  displayName = 'Manual (External AI)';

  capabilities = {
    imageGeneration: false, // Not automatic
    imageComposition: false,
    // ... etc
  };

  async generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    // Return instructions for manual workflow
    return {
      success: true,
      images: [],
      metadata: { ... },
      instructions: {
        prompt: this.buildPrompt(...),
        negativePrompt: this.buildNegativePrompt(...),
        suggestedServices: ['Midjourney', 'DALL-E', 'Stable Diffusion'],
        steps: [
          'Download the template with guides',
          'Use this prompt with your preferred AI service',
          'Upload the generated image back'
        ]
      }
    };
  }
}
```

### 2.3 Nana Banana Provider (`src/services/ai/providers/NanaBananaProvider.ts`)

```typescript
/**
 * Implement Nana Banana integration (or stub it for now):
 * - Image generation from prompts
 * - Multi-layer composition
 * - Style transfer from reference images
 */

export class NanaBananaProvider extends AIServiceAdapter {
  name = 'nanabanana';
  displayName = 'Nana Banana AI';

  private apiKey: string;
  private endpoint: string;

  constructor(config: NanaBananaConfig) {
    super();
    this.apiKey = config.apiKey;
    this.endpoint = config.apiEndpoint || 'https://api.nanabanana.ai';
  }

  async generateImage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    // Implement API call to Nana Banana
    // POST to /generate endpoint
    // Handle response and convert to standard format
  }

  async composeImage(request: AICompositionRequest): Promise<AIGenerationResponse> {
    // Implement multi-layer composition
    // POST to /compose endpoint
  }

  async isAvailable(): Promise<boolean> {
    // Check API health endpoint
  }

  async validateCredentials(): Promise<boolean> {
    // Validate API key
  }
}
```

### 2.4 Prompt Builder (`src/services/ai/PromptBuilder.ts`)

```typescript
/**
 * Implement a PromptBuilder that:
 * - Loads prompt templates from widget's prompts/backend.json
 * - Substitutes variables into templates
 * - Handles safe zone descriptions
 * - Builds complete prompts for AI generation
 */

import type { PromptBuilder as IPromptBuilder, PromptTemplate, PromptVariables } from '../../core/types';

export class PromptBuilder implements IPromptBuilder {
  build(template: PromptTemplate, variables: PromptVariables): string;
  addQualityEnhancers(prompt: string, enhancers: string[]): string;
  buildNegativePrompt(baseNegatives: string[], additions?: string[]): string;

  // Load prompts from widget configuration
  async loadWidgetPrompts(widgetId: string): Promise<BackendPrompts>;

  // Build safe zone description from template
  buildSafeZoneDescription(template: Template): string;

  // Get style preset prompt
  getStylePreset(prompts: BackendPrompts, styleName: string): string;
}

export const promptBuilder = new PromptBuilder();
```

---

## 3. STATE MANAGEMENT

### 3.1 Widget Store (`src/store/widgetStore.ts`)

```typescript
/**
 * Implement Zustand store for widget state:
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface WidgetStore {
  // Active widget
  activeWidgetId: string | null;
  activeTemplateId: string | null;

  // Field values
  fields: Record<string, any>;

  // Design state
  design: DesignState;

  // UI state
  showGuides: boolean;
  previewMode: 'preview' | 'export';

  // Actions
  setActiveWidget: (widgetId: string) => void;
  setActiveTemplate: (templateId: string) => void;
  updateField: (fieldId: string, value: any) => void;
  updateFields: (fields: Record<string, any>) => void;
  updateDesign: (design: Partial<DesignState>) => void;
  setShowGuides: (show: boolean) => void;
  reset: () => void;
}

export const useWidgetStore = create<WidgetStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        activeWidgetId: null,
        activeTemplateId: null,
        fields: {},
        design: {
          backgroundColor: '#1a2744',
          textColor: '#f8fafc',
        },
        showGuides: false,
        previewMode: 'preview',

        // Implement actions
        setActiveWidget: (widgetId) => { ... },
        // ... etc
      }),
      { name: 'widget-store' }
    )
  )
);
```

### 3.2 Pipeline Store (`src/store/pipelineStore.ts`)

```typescript
/**
 * Store for pipeline execution state
 */

interface PipelineStore {
  status: PipelineStatus;
  aiState: AIWorkflowState;
  errors: ValidationError[];
  history: HistoryState;

  // Actions
  setStatus: (status: PipelineStatus) => void;
  setAIState: (state: Partial<AIWorkflowState>) => void;
  addError: (error: ValidationError) => void;
  clearErrors: () => void;
  pushHistory: (snapshot: PipelineSnapshot) => void;
  undo: () => void;
  redo: () => void;
}

export const usePipelineStore = create<PipelineStore>()(...);
```

### 3.3 Preset Store (`src/store/presetStore.ts`)

```typescript
/**
 * Store for user presets with localStorage persistence
 */

interface PresetStore {
  presets: Preset[];
  collections: PresetCollection[];

  // Actions
  savePreset: (preset: Omit<Preset, 'id' | 'createdAt' | 'updatedAt'>) => Preset;
  updatePreset: (id: string, updates: Partial<Preset>) => void;
  deletePreset: (id: string) => void;
  duplicatePreset: (id: string) => Preset;
  applyPreset: (id: string) => void;

  // Collections
  createCollection: (name: string) => PresetCollection;
  addToCollection: (collectionId: string, presetId: string) => void;
  removeFromCollection: (collectionId: string, presetId: string) => void;

  // Import/Export
  exportPresets: (ids: string[]) => ExportedPresets;
  importPresets: (data: ExportedPresets) => Preset[];
}

export const usePresetStore = create<PresetStore>()(
  persist(..., { name: 'preset-store' })
);
```

---

## 4. REACT HOOKS

### 4.1 useWidget Hook (`src/hooks/useWidget.ts`)

```typescript
/**
 * Hook for loading and managing widgets
 */

export function useWidget(widgetId?: string) {
  const [widget, setWidget] = useState<Widget | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load widget on mount or when widgetId changes
  useEffect(() => { ... }, [widgetId]);

  // Return widget data and actions
  return {
    widget,
    templates,
    loading,
    error,
    reload: () => { ... },
  };
}
```

### 4.2 usePipeline Hook (`src/hooks/usePipeline.ts`)

```typescript
/**
 * Main hook for pipeline operations
 */

export function usePipeline(widgetId: string) {
  const pipelineRef = useRef<PipelineEngine | null>(null);
  const [state, setState] = useState<PipelineState | null>(null);

  // Initialize pipeline
  useEffect(() => {
    const pipeline = createPipeline();
    pipelineRef.current = pipeline;

    pipeline.initialize(widgetId).then(setState);

    const unsubscribe = pipeline.subscribe(setState);
    return () => {
      unsubscribe();
      pipeline.dispose();
    };
  }, [widgetId]);

  return {
    state,
    updateFields: (fields) => pipelineRef.current?.updateFields(fields),
    updateDesign: (design) => pipelineRef.current?.updateDesign(design),
    generateWithAI: (options) => pipelineRef.current?.generateWithAI(options),
    render: () => pipelineRef.current?.render(),
    export: (options) => pipelineRef.current?.export(options),
    undo: () => pipelineRef.current?.undo(),
    redo: () => pipelineRef.current?.redo(),
    reset: () => pipelineRef.current?.reset(),
  };
}
```

### 4.3 useAIGeneration Hook (`src/hooks/useAIGeneration.ts`)

```typescript
/**
 * Hook for AI generation operations
 */

export function useAIGeneration() {
  const [status, setStatus] = useState<AIWorkflowStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GeneratedImage[] | null>(null);
  const [error, setError] = useState<AIError | null>(null);

  const generate = async (
    widgetId: string,
    template: Template,
    design: DesignState,
    options?: AIGenerationOptions
  ) => {
    setStatus('generating');
    setProgress(0);
    // ... implementation
  };

  const cancel = () => { ... };

  return { status, progress, result, error, generate, cancel };
}
```

### 4.4 usePresets Hook (`src/hooks/usePresets.ts`)

```typescript
/**
 * Hook for preset management
 */

export function usePresets(widgetId?: string) {
  const store = usePresetStore();

  const presets = useMemo(() =>
    widgetId
      ? store.presets.filter(p => p.widgetId === widgetId)
      : store.presets,
    [store.presets, widgetId]
  );

  return {
    presets,
    save: store.savePreset,
    update: store.updatePreset,
    delete: store.deletePreset,
    duplicate: store.duplicatePreset,
    apply: store.applyPreset,
    export: store.exportPresets,
    import: store.importPresets,
  };
}
```

---

## 5. REACT COMPONENTS

### 5.1 Widget Composer (`src/components/composer/WidgetComposer.tsx`)

```typescript
/**
 * Main composer component that replaces Index.tsx
 * - Loads widget based on route/prop
 * - Renders dynamic form for fields
 * - Shows live canvas preview
 * - Provides template selection
 * - Handles AI generation
 * - Manages export
 */

interface WidgetComposerProps {
  widgetId: string;
  presetId?: string;
}

export function WidgetComposer({ widgetId, presetId }: WidgetComposerProps) {
  const { state, updateFields, updateDesign, generateWithAI, export: exportCard } = usePipeline(widgetId);

  if (!state?.widget) return <WidgetLoader />;

  return (
    <div className="widget-composer">
      <header>
        <h1>{state.widget.metadata.name}</h1>
        <p>{state.widget.metadata.description}</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Canvas Preview */}
        <CanvasPreview
          widget={state.widget}
          template={state.template}
          fields={state.fields}
          design={state.design}
          showGuides={showGuides}
        />

        {/* Controls Panel */}
        <div className="controls">
          <TemplateSelector
            templates={templates}
            selected={state.template?.id}
            onSelect={handleTemplateChange}
          />

          <DynamicForm
            fields={state.widget.fields}
            values={state.fields}
            onChange={updateFields}
            errors={state.errors}
          />

          <DesignControls
            design={state.design}
            colorSchemes={state.template?.colorSchemes}
            onChange={updateDesign}
          />

          <AIGenerationPanel
            widget={state.widget}
            template={state.template}
            onGenerate={generateWithAI}
            status={state.aiState.status}
          />

          <ExportPanel
            widget={state.widget}
            onExport={exportCard}
          />
        </div>
      </main>
    </div>
  );
}
```

### 5.2 Dynamic Form (`src/components/composer/DynamicForm.tsx`)

```typescript
/**
 * Generates form fields from widget field definitions
 */

interface DynamicFormProps {
  fields: FieldDefinition[];
  values: Record<string, any>;
  onChange: (fields: Record<string, any>) => void;
  errors: ValidationError[];
}

export function DynamicForm({ fields, values, onChange, errors }: DynamicFormProps) {
  const renderField = (field: FieldDefinition) => {
    // Check conditional visibility
    if (field.conditional && !evaluateCondition(field.conditional, values)) {
      return null;
    }

    switch (field.type) {
      case 'text':
        return <TextField field={field} value={values[field.id]} onChange={...} error={...} />;
      case 'textarea':
        return <TextAreaField ... />;
      case 'select':
        return <SelectField ... />;
      case 'number':
        return <NumberField ... />;
      case 'image':
        return <ImageUploadField ... />;
      case 'color':
        return <ColorField ... />;
      case 'date':
        return <DateField ... />;
      // ... etc
    }
  };

  return (
    <div className="space-y-4">
      {fields.map(field => (
        <div key={field.id}>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}
```

### 5.3 Canvas Preview (`src/components/composer/CanvasPreview.tsx`)

```typescript
/**
 * Live preview canvas component
 */

interface CanvasPreviewProps {
  widget: Widget;
  template: Template | null;
  fields: Record<string, any>;
  design: DesignState;
  showGuides?: boolean;
}

export function CanvasPreview({ widget, template, fields, design, showGuides }: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendered, setRendered] = useState<string | null>(null);

  // Render on state changes (debounced)
  useEffect(() => {
    if (!canvasRef.current || !template) return;

    const render = async () => {
      renderEngine.setCanvas(canvasRef.current!);
      const output = await renderEngine.renderPreview({
        widget,
        template,
        fields,
        design,
        showGuides
      });
      setRendered(output.dataUrl);
    };

    const timer = setTimeout(render, 100);
    return () => clearTimeout(timer);
  }, [widget, template, fields, design, showGuides]);

  return (
    <div className="canvas-preview">
      <canvas
        ref={canvasRef}
        width={widget.canvas.width * widget.canvas.previewScale}
        height={widget.canvas.height * widget.canvas.previewScale}
        className="rounded-lg shadow-lg"
      />

      {showGuides && (
        <div className="text-sm text-muted-foreground mt-2">
          Showing field guides and safe zones
        </div>
      )}
    </div>
  );
}
```

### 5.4 Widget Gallery (`src/components/widgets/WidgetGallery.tsx`)

```typescript
/**
 * Gallery to browse and select widgets
 */

export function WidgetGallery() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    widgetRegistry.discoverWidgets().then(() => {
      setWidgets(widgetRegistry.getAll());
    });
  }, []);

  const filteredWidgets = filter === 'all'
    ? widgets
    : widgets.filter(w => w.metadata.category === filter);

  return (
    <div className="widget-gallery">
      <header>
        <h1>Create Something Beautiful</h1>
        <p>Choose a template type to get started</p>

        <CategoryFilter
          categories={['all', 'professional', 'creative', 'celebration', 'marketing']}
          selected={filter}
          onChange={setFilter}
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWidgets.map(widget => (
          <WidgetCard
            key={widget.metadata.id}
            widget={widget}
            onClick={() => navigate(`/create/${widget.metadata.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 6. ROUTING

### 6.1 App Routes (`src/App.tsx`)

```typescript
/**
 * Update routing to support widget selection and creation
 */

import { WidgetGallery } from './components/widgets/WidgetGallery';
import { WidgetComposer } from './components/composer/WidgetComposer';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Home - Widget Gallery */}
          <Route path="/" element={<WidgetGallery />} />

          {/* Create with specific widget */}
          <Route path="/create/:widgetId" element={<WidgetComposerRoute />} />

          {/* Create with preset */}
          <Route path="/create/:widgetId/preset/:presetId" element={<WidgetComposerRoute />} />

          {/* Manage presets */}
          <Route path="/presets" element={<PresetManager />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function WidgetComposerRoute() {
  const { widgetId, presetId } = useParams();
  if (!widgetId) return <Navigate to="/" />;
  return <WidgetComposer widgetId={widgetId} presetId={presetId} />;
}
```

---

## 7. UTILITY FUNCTIONS

### 7.1 Widget Loader (`src/core/utils/widgetLoader.ts`)

```typescript
/**
 * Utilities for loading widget configurations
 */

// Dynamic import of widget.json files
export async function loadWidgetConfig(widgetId: string): Promise<Widget> {
  const module = await import(`../../widgets/${widgetId}/widget.json`);
  return module.default as Widget;
}

// Load template for widget
export async function loadTemplateConfig(widgetId: string, templateId: string): Promise<Template> {
  const module = await import(`../../widgets/${widgetId}/templates/${templateId}.json`);
  return module.default as Template;
}

// Load prompts for widget
export async function loadWidgetPrompts(widgetId: string): Promise<{ backend: BackendPrompts; frontend: FrontendPrompts }> {
  const [backend, frontend] = await Promise.all([
    import(`../../widgets/${widgetId}/prompts/backend.json`),
    import(`../../widgets/${widgetId}/prompts/frontend.json`)
  ]);
  return { backend: backend.default, frontend: frontend.default };
}

// Discover all widgets
export async function discoverAllWidgets(): Promise<string[]> {
  // Use Vite's glob import
  const modules = import.meta.glob('../../widgets/*/widget.json');
  return Object.keys(modules).map(path => {
    const match = path.match(/widgets\/([^/]+)\/widget\.json/);
    return match ? match[1] : '';
  }).filter(Boolean);
}
```

### 7.2 QR Code Generator (`src/core/utils/generators.ts`)

```typescript
/**
 * Generators for dynamic field types
 */

import QRCode from 'qrcode';

export async function generateQRCode(data: string, size: number): Promise<string> {
  return QRCode.toDataURL(data, {
    width: size,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
}

export async function generateBarcode(data: string, format: string): Promise<string> {
  // Implement barcode generation
}

export function generateGradient(config: GradientConfig, width: number, height: number): string {
  // Generate gradient as data URL
}
```

---

## 8. INSTALLATION & DEPENDENCIES

Add these dependencies:

```bash
npm install zustand qrcode
npm install -D @types/qrcode
```

---

## 9. FILE STRUCTURE AFTER IMPLEMENTATION

```
src/
├── core/
│   ├── types/              # ✅ Exists
│   ├── engine/
│   │   ├── WidgetRegistry.ts
│   │   ├── TemplateRegistry.ts
│   │   ├── RenderEngine.ts
│   │   ├── ExportEngine.ts
│   │   ├── PipelineEngine.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── widgetLoader.ts
│   │   ├── generators.ts
│   │   └── validation.ts
│   └── index.ts
├── services/
│   ├── ai/
│   │   ├── AIServiceAdapter.ts
│   │   ├── PromptBuilder.ts
│   │   ├── providers/
│   │   │   ├── ManualProvider.ts
│   │   │   ├── NanaBananaProvider.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── storage/
│       ├── PresetStorage.ts
│       └── AssetStorage.ts
├── store/
│   ├── widgetStore.ts
│   ├── pipelineStore.ts
│   ├── presetStore.ts
│   └── index.ts
├── hooks/
│   ├── useWidget.ts
│   ├── usePipeline.ts
│   ├── useAIGeneration.ts
│   ├── usePresets.ts
│   └── index.ts
├── components/
│   ├── composer/
│   │   ├── WidgetComposer.tsx
│   │   ├── CanvasPreview.tsx
│   │   ├── DynamicForm.tsx
│   │   ├── TemplateSelector.tsx
│   │   ├── DesignControls.tsx
│   │   ├── AIGenerationPanel.tsx
│   │   ├── ExportPanel.tsx
│   │   └── index.ts
│   ├── widgets/
│   │   ├── WidgetGallery.tsx
│   │   ├── WidgetCard.tsx
│   │   ├── WidgetLoader.tsx
│   │   └── index.ts
│   ├── presets/
│   │   ├── PresetManager.tsx
│   │   ├── PresetPicker.tsx
│   │   ├── PresetCard.tsx
│   │   └── index.ts
│   ├── fields/
│   │   ├── TextField.tsx
│   │   ├── TextAreaField.tsx
│   │   ├── SelectField.tsx
│   │   ├── NumberField.tsx
│   │   ├── ImageUploadField.tsx
│   │   ├── ColorField.tsx
│   │   ├── DateField.tsx
│   │   └── index.ts
│   └── ui/                 # ✅ Exists (shadcn)
├── widgets/                # ✅ Exists
├── pages/
│   └── NotFound.tsx
├── App.tsx
├── main.tsx
└── index.css
```

---

## 10. IMPLEMENTATION ORDER

1. **Phase 1: Core Engines** (foundation)
   - WidgetRegistry
   - TemplateRegistry
   - RenderEngine
   - ExportEngine

2. **Phase 2: State & Hooks** (data flow)
   - Zustand stores
   - React hooks

3. **Phase 3: Pipeline** (orchestration)
   - PipelineEngine
   - Wire everything together

4. **Phase 4: Components** (UI)
   - DynamicForm + field components
   - CanvasPreview
   - WidgetComposer
   - WidgetGallery

5. **Phase 5: AI Integration** (enhancement)
   - AIServiceAdapter
   - ManualProvider
   - PromptBuilder
   - NanaBananaProvider (if API available)

6. **Phase 6: Presets** (persistence)
   - PresetStorage
   - PresetManager UI

---

## IMPORTANT NOTES

1. **Use the existing types** - All interfaces are defined in `src/core/types/`. Import from there, don't redefine.

2. **Keep existing UI components** - Use shadcn/ui components from `src/components/ui/`.

3. **Follow existing patterns** - Match the code style of the existing codebase.

4. **Incremental migration** - The old `Index.tsx` can remain until the new system is complete.

5. **Type safety** - Use strict TypeScript. No `any` types except where absolutely necessary.

6. **Error handling** - All async operations should have proper try/catch and user-friendly error messages.

7. **Testing** - Write unit tests for engines and integration tests for hooks.

---

## PROMPT END

---

## Usage Instructions

1. Copy everything between "PROMPT START" and "PROMPT END"
2. Paste into your AI code generator (Claude, GPT-4, Cursor, etc.)
3. Ask it to implement specific sections (e.g., "Implement the WidgetRegistry and TemplateRegistry")
4. Review and iterate on the generated code
5. Integrate into your project incrementally

For best results, ask the AI to implement one section at a time rather than everything at once.
