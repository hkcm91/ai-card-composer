/**
 * Pipeline Types
 *
 * The Pipeline orchestrates the entire widget creation flow from
 * configuration loading through AI generation to final export.
 */

import type { Widget, Template, ExportFormat, ResolutionConfig } from './widget.types';
import type { AIGenerationResponse, AIWorkflowState, AIServiceProvider } from './ai.types';
import type { Preset } from './preset.types';

// =============================================================================
// PIPELINE ENGINE
// =============================================================================

export interface PipelineEngine {
  /** Load a widget by ID */
  loadWidget(widgetId: string): Promise<Widget>;

  /** Load a template for the current widget */
  loadTemplate(templateId: string): Promise<Template>;

  /** Initialize pipeline with widget and optional preset */
  initialize(widgetId: string, presetId?: string): Promise<PipelineState>;

  /** Update field values */
  updateFields(fields: Record<string, any>): void;

  /** Update design settings */
  updateDesign(design: Partial<DesignState>): void;

  /** Trigger AI generation */
  generateWithAI(options?: AIGenerationOptions): Promise<AIGenerationResponse>;

  /** Render current state to canvas */
  render(): Promise<RenderedOutput>;

  /** Export final output */
  export(options: ExportOptions): Promise<ExportResult>;

  /** Get current pipeline state */
  getState(): PipelineState;

  /** Subscribe to state changes */
  subscribe(callback: PipelineStateCallback): () => void;

  /** Reset pipeline */
  reset(): void;

  /** Dispose resources */
  dispose(): void;
}

export type PipelineStateCallback = (state: PipelineState) => void;

// =============================================================================
// PIPELINE STATE
// =============================================================================

export interface PipelineState {
  /** Current status */
  status: PipelineStatus;

  /** Active widget configuration */
  widget: Widget | null;

  /** Active template */
  template: Template | null;

  /** Applied preset (if any) */
  preset: Preset | null;

  /** Current field values */
  fields: Record<string, any>;

  /** Current design state */
  design: DesignState;

  /** AI workflow state */
  aiState: AIWorkflowState;

  /** Render state */
  renderState: RenderState;

  /** Validation errors */
  errors: ValidationError[];

  /** Is the current state dirty (unsaved changes) */
  isDirty: boolean;

  /** History for undo/redo */
  history: HistoryState;
}

export type PipelineStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'generating'
  | 'rendering'
  | 'exporting'
  | 'error';

export interface DesignState {
  backgroundColor: string;
  textColor: string;
  accentColor?: string;
  backgroundImage?: string;
  colorScheme?: string;
  customFonts?: Record<string, string>;
}

export interface RenderState {
  /** Currently rendered output */
  canvas?: HTMLCanvasElement;

  /** Rendered image as data URL */
  imageDataUrl?: string;

  /** Render dimensions */
  width: number;
  height: number;

  /** Current scale factor */
  scale: number;

  /** Last render timestamp */
  lastRenderTime?: Date;

  /** Render quality */
  quality: 'preview' | 'export';
}

export interface ValidationError {
  fieldId: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface HistoryState {
  past: PipelineSnapshot[];
  future: PipelineSnapshot[];
  canUndo: boolean;
  canRedo: boolean;
}

export interface PipelineSnapshot {
  fields: Record<string, any>;
  design: DesignState;
  timestamp: Date;
  description?: string;
}

// =============================================================================
// AI GENERATION OPTIONS
// =============================================================================

export interface AIGenerationOptions {
  /** Override the default provider */
  provider?: string;

  /** Style to apply */
  style?: string;

  /** Custom prompt override */
  prompt?: string;

  /** Reference images */
  referenceImages?: string[];

  /** Number of variations to generate */
  variations?: number;

  /** Seed for reproducibility */
  seed?: number;

  /** Skip safe zone handling */
  ignoreSafeZones?: boolean;
}

// =============================================================================
// RENDER ENGINE
// =============================================================================

export interface RenderEngine {
  /** Set the canvas element */
  setCanvas(canvas: HTMLCanvasElement): void;

  /** Render widget with current state */
  render(state: RenderInput): Promise<RenderedOutput>;

  /** Render preview (lower quality, faster) */
  renderPreview(state: RenderInput): Promise<RenderedOutput>;

  /** Render for export (high quality) */
  renderExport(state: RenderInput, options: ExportRenderOptions): Promise<RenderedOutput>;

  /** Render template guides overlay */
  renderGuides(template: Template, options: GuideOptions): void;

  /** Clear canvas */
  clear(): void;

  /** Get canvas context */
  getContext(): CanvasRenderingContext2D | null;
}

export interface RenderInput {
  widget: Widget;
  template: Template;
  fields: Record<string, any>;
  design: DesignState;
  showGuides?: boolean;
}

export interface RenderedOutput {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  format: 'png' | 'jpg' | 'webp';
}

export interface ExportRenderOptions {
  scale: number;
  format: ExportFormat;
  quality: number;
  includeBleed: boolean;
  includeSafeZone: boolean;
}

export interface GuideOptions {
  showFieldBounds: boolean;
  showSafeZone: boolean;
  showBleed: boolean;
  showGrid: boolean;
  guideColor: string;
  guideOpacity: number;
}

// =============================================================================
// EXPORT ENGINE
// =============================================================================

export interface ExportEngine {
  /** Export to specified format */
  export(input: ExportInput): Promise<ExportResult>;

  /** Export multiple formats at once */
  exportMultiple(input: ExportInput, formats: ExportFormat[]): Promise<ExportResult[]>;

  /** Get supported formats */
  getSupportedFormats(): ExportFormat[];

  /** Estimate file size */
  estimateSize(input: ExportInput): number;
}

export interface ExportInput {
  canvas: HTMLCanvasElement;
  widget: Widget;
  fields: Record<string, any>;
  options: ExportOptions;
}

export interface ExportOptions {
  format: ExportFormat;
  resolution: string | ResolutionConfig;
  quality?: number;  // 0-1 for lossy formats
  filename?: string;
  includeBleed?: boolean;
  metadata?: ExportMetadata;
}

export interface ExportMetadata {
  title?: string;
  author?: string;
  description?: string;
  keywords?: string[];
  copyright?: string;
  createdWith?: string;
}

export interface ExportResult {
  blob: Blob;
  dataUrl: string;
  filename: string;
  format: ExportFormat;
  size: number;
  dimensions: { width: number; height: number };
  metadata?: ExportMetadata;
}

// =============================================================================
// WIDGET REGISTRY
// =============================================================================

export interface WidgetRegistry {
  /** Register a widget */
  register(widget: Widget): void;

  /** Get a widget by ID */
  get(widgetId: string): Widget | null;

  /** Get all registered widgets */
  getAll(): Widget[];

  /** Get widgets by category */
  getByCategory(category: string): Widget[];

  /** Search widgets */
  search(query: string): Widget[];

  /** Check if widget exists */
  has(widgetId: string): boolean;

  /** Load widget from path/URL */
  load(path: string): Promise<Widget>;

  /** Unregister a widget */
  unregister(widgetId: string): void;
}

// =============================================================================
// TEMPLATE REGISTRY
// =============================================================================

export interface TemplateRegistry {
  /** Register a template */
  register(widgetId: string, template: Template): void;

  /** Get a template */
  get(widgetId: string, templateId: string): Template | null;

  /** Get all templates for a widget */
  getForWidget(widgetId: string): Template[];

  /** Load template from path/URL */
  load(widgetId: string, path: string): Promise<Template>;

  /** Unregister a template */
  unregister(widgetId: string, templateId: string): void;
}

// =============================================================================
// PIPELINE EVENTS
// =============================================================================

export type PipelineEventType =
  | 'pipeline:initialized'
  | 'pipeline:stateChanged'
  | 'pipeline:widgetLoaded'
  | 'pipeline:templateChanged'
  | 'pipeline:fieldsUpdated'
  | 'pipeline:designUpdated'
  | 'pipeline:aiStarted'
  | 'pipeline:aiCompleted'
  | 'pipeline:aiError'
  | 'pipeline:renderStarted'
  | 'pipeline:renderCompleted'
  | 'pipeline:exportStarted'
  | 'pipeline:exportCompleted'
  | 'pipeline:error'
  | 'pipeline:reset';

export interface PipelineEvent {
  type: PipelineEventType;
  timestamp: Date;
  data?: any;
}

export type PipelineEventHandler = (event: PipelineEvent) => void;

// =============================================================================
// PIPELINE CONFIGURATION
// =============================================================================

export interface PipelineConfig {
  /** Path to widgets directory */
  widgetsPath: string;

  /** Available AI providers */
  aiProviders: AIServiceProvider[];

  /** Default AI provider */
  defaultAIProvider?: string;

  /** Auto-render on state changes */
  autoRender: boolean;

  /** Render debounce delay in ms */
  renderDebounce: number;

  /** Enable history (undo/redo) */
  enableHistory: boolean;

  /** Max history entries */
  maxHistorySize: number;

  /** Auto-save drafts */
  autoSave: boolean;

  /** Auto-save interval in ms */
  autoSaveInterval: number;
}
