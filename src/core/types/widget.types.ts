/**
 * Widget Configuration Types
 *
 * A Widget represents a complete, self-contained configuration for generating
 * a specific type of visual content (business cards, tarot cards, flyers, etc.)
 */

// =============================================================================
// CORE WIDGET DEFINITION
// =============================================================================

export interface Widget {
  $schema?: string;
  version: string;
  metadata: WidgetMetadata;
  canvas: CanvasConfig;
  fields: FieldDefinition[];
  templates: TemplateRegistry;
  prompts: PromptConfig;
  assets: AssetConfig;
  export: ExportConfig;
  aiWorkflow: AIWorkflowConfig;
}

export interface WidgetMetadata {
  id: string;
  name: string;
  description: string;
  category: WidgetCategory;
  tags: string[];
  icon?: string;
  thumbnail?: string;
  author?: string;
  version?: string;
}

export type WidgetCategory =
  | 'professional'
  | 'creative'
  | 'celebration'
  | 'marketing'
  | 'social'
  | 'personal'
  | 'custom';

// =============================================================================
// CANVAS CONFIGURATION
// =============================================================================

export interface CanvasConfig {
  width: number;
  height: number;
  unit: 'px' | 'in' | 'mm' | 'cm';
  aspectRatio: string;
  previewScale: number;
  bleed?: BleedConfig;
  safeZone?: SafeZoneConfig;
  foldable?: boolean;
  foldType?: 'half-horizontal' | 'half-vertical' | 'tri-fold' | 'z-fold';
  printSize?: PrintSize;
}

export interface BleedConfig {
  enabled: boolean;
  size: number;
}

export interface SafeZoneConfig {
  enabled: boolean;
  margin: number;
}

export interface PrintSize {
  width: number;
  height: number;
  unit: 'in' | 'mm' | 'cm';
}

// =============================================================================
// FIELD DEFINITIONS
// =============================================================================

export interface FieldDefinition {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: any;
  validation?: FieldValidation;
  style?: FieldStyle;
  conditional?: FieldConditional;

  // Type-specific properties
  options?: SelectOption[];           // For 'select' type
  maxLength?: number;                 // For 'text' and 'textarea'
  min?: number;                       // For 'number'
  max?: number;                       // For 'number'
  maxSize?: string;                   // For 'image' (e.g., "2MB")
  acceptedFormats?: string[];         // For 'image'
  dimensions?: ImageDimensions;       // For 'image'
  generator?: GeneratorType;          // For 'generated' type
  source?: string;                    // For 'generated' type (field ID to use)
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'time'
  | 'datetime'
  | 'color'
  | 'image'
  | 'generated'
  | 'toggle'
  | 'slider';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

export interface FieldValidation {
  pattern?: string;
  message?: string;
  custom?: (value: any) => boolean | string;
}

export interface FieldStyle {
  fontFamily?: string;
  fontSize?: FontSizeRange | number;
  fontWeight?: FontWeight | FontWeight[];
  defaultWeight?: FontWeight;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: string;
}

export interface FontSizeRange {
  min: number;
  max: number;
  default: number;
}

export type FontWeight = 'normal' | 'bold' | 'light' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export interface ImageDimensions {
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio?: string;
}

export type GeneratorType = 'qrcode' | 'barcode' | 'avatar' | 'pattern' | 'gradient';

export interface FieldConditional {
  dependsOn: string;
  condition: 'equals' | 'notEquals' | 'contains' | 'isEmpty' | 'isNotEmpty';
  value?: any;
}

// =============================================================================
// TEMPLATE CONFIGURATION
// =============================================================================

export interface TemplateRegistry {
  default: string;
  available: string[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  layout: LayoutConfig;
  fields: Record<string, TemplateFieldConfig>;
  background: BackgroundConfig;
  colorSchemes: ColorScheme[];
  decorations?: Decoration[];
}

export interface LayoutConfig {
  type: 'absolute' | 'grid' | 'flex';
  grid?: GridConfig;
  flex?: FlexConfig;
}

export interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
}

export interface FlexConfig {
  direction: 'row' | 'column';
  justify: 'start' | 'center' | 'end' | 'between' | 'around';
  align: 'start' | 'center' | 'end' | 'stretch';
  gap: number;
}

export interface TemplateFieldConfig {
  position: Position;
  size: Size;
  style: TemplateFieldStyle;
  icon?: string;
  animation?: AnimationType;
  type?: 'text' | 'image' | 'generated';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
}

export interface Position {
  x: number;
  y: number;
  anchor?: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export interface Size {
  width: number;
  height: number;
}

export interface TemplateFieldStyle {
  fontSize: number;
  fontWeight: FontWeight;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  opacity?: number;
  textTransform?: string;
  letterSpacing?: string;
  lineHeight?: number;
}

export type AnimationType =
  | 'fade-in'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'fade-in-up'
  | 'fade-in-down'
  | 'scale-in'
  | 'slide-in';

export interface BackgroundConfig {
  default: BackgroundDefault;
  aiSuggestions?: string[];
}

export interface BackgroundDefault {
  type: 'solid' | 'gradient' | 'image' | 'pattern';
  color?: string;
  gradient?: GradientConfig;
  imageUrl?: string;
  pattern?: PatternConfig;
}

export interface GradientConfig {
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
  stops: GradientStop[];
}

export interface GradientStop {
  color: string;
  position: number;
}

export interface PatternConfig {
  type: string;
  scale: number;
  opacity: number;
}

export interface ColorScheme {
  name: string;
  background: string;
  text: string;
  accent: string;
  secondary?: string;
}

export interface Decoration {
  id: string;
  type: 'line' | 'shape' | 'icon' | 'border';
  position: Position;
  size: Size;
  style: DecorationStyle;
}

export interface DecorationStyle {
  color?: string;
  opacity?: number;
  strokeWidth?: number;
  fill?: boolean;
  borderRadius?: number;
}

// =============================================================================
// PROMPT CONFIGURATION
// =============================================================================

export interface PromptConfig {
  backend: string;   // Path to backend prompts JSON
  frontend: string;  // Path to frontend prompts JSON
}

export interface BackendPrompts {
  version: string;
  provider: string;
  systemPrompt: SystemPrompt;
  templates: PromptTemplates;
  qualityEnhancers: string[];
  negativePrompts: string[];
}

export interface SystemPrompt {
  role: string;
  context: string;
  constraints: string[];
}

export interface PromptTemplates {
  backgroundGeneration: BackgroundGenerationPrompt;
  styleTransfer?: StyleTransferPrompt;
  compositing?: CompositingPrompt;
}

export interface BackgroundGenerationPrompt {
  base: string;
  variables: Record<string, string[]>;
  modifiers: Record<string, string>;
}

export interface StyleTransferPrompt {
  base: string;
  referenceHandling: string;
}

export interface CompositingPrompt {
  nanaBanana?: NanaBananaPrompt;
  generic?: GenericCompositingPrompt;
}

export interface NanaBananaPrompt {
  prompt: string;
  layers: LayerConfig[];
}

export interface LayerConfig {
  type: 'background' | 'overlay' | 'accent' | 'text' | 'decoration';
  source: string;
  blendMode?: BlendMode;
  opacity?: number;
}

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'soft-light'
  | 'hard-light';

export interface GenericCompositingPrompt {
  prompt: string;
  instructions: string[];
}

export interface FrontendPrompts {
  version: string;
  ui: UIPrompts;
  validation: ValidationPrompts;
  help: HelpPrompts;
}

export interface UIPrompts {
  workflow: WorkflowPrompt;
  tooltips: Record<string, string>;
  suggestions: SuggestionPrompts;
}

export interface WorkflowPrompt {
  title: string;
  description: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

export interface SuggestionPrompts {
  styles: StyleSuggestion[];
}

export interface StyleSuggestion {
  label: string;
  prompt: string;
  thumbnail?: string;
}

export interface ValidationPrompts {
  messages: Record<string, string>;
}

export interface HelpPrompts {
  aiWorkflow: HelpSection;
  [key: string]: HelpSection;
}

export interface HelpSection {
  title: string;
  content: string;
}

// =============================================================================
// ASSET CONFIGURATION
// =============================================================================

export interface AssetConfig {
  fonts: string[];
  icons?: string;
  reference?: string;
  textures?: string;
}

// =============================================================================
// EXPORT CONFIGURATION
// =============================================================================

export interface ExportConfig {
  formats: ExportFormat[];
  defaultFormat: ExportFormat;
  resolutions: Record<string, ResolutionConfig>;
}

export type ExportFormat = 'png' | 'jpg' | 'jpeg' | 'pdf' | 'svg' | 'webp';

export interface ResolutionConfig {
  dpi: number;
  scale: number;
}

// =============================================================================
// AI WORKFLOW CONFIGURATION
// =============================================================================

export interface AIWorkflowConfig {
  enabled: boolean;
  provider: AIProvider | 'auto';
  features: AIFeatures;
}

export type AIProvider =
  | 'nanabanana'
  | 'midjourney'
  | 'dalle'
  | 'stable-diffusion'
  | 'replicate'
  | 'manual';

export interface AIFeatures {
  backgroundGeneration: boolean;
  styleTransfer: boolean;
  colorHarmonization: boolean;
  textEnhancement: boolean;
  autoComposition?: boolean;
}
